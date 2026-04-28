import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/product.entity';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderQueryDto } from './dto/order-query.dto';

import { OrderStatus } from '../common/enums/order-status.enum';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly dataSource: DataSource,
  ) {}

  // ✅ CREATE ORDER (transaction)
  async create(dto: CreateOrderDto, userId: number): Promise<Order> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await qr.manager.findOne(Product, {
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Product #${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}"`,
          );
        }

        // decrease stock
        product.stock -= item.quantity;
        await qr.manager.save(product);

        const orderItem = qr.manager.create(OrderItem, {
          product,
          quantity: item.quantity,
          price: product.price,
        });

        orderItems.push(orderItem);

        totalPrice += Number(product.price) * item.quantity;
      }

      const order = qr.manager.create(Order, {
        user: { id: userId } as any,
        items: orderItems,
        totalPrice,
        status: OrderStatus.PENDING,
      });

      const saved = await qr.manager.save(order);

      await qr.commitTransaction();

      return saved;
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }

  // ✅ GET ALL (pagination + filter + ownership)
  async findAll(
    query: OrderQueryDto,
    userId: number,
    role: Role,
  ) {
    const { page = 1, pageSize = 10, status } = query;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product');

    // 🔐 ownership
    if (role !== Role.ADMIN) {
      qb.andWhere('order.userId = :userId', { userId });
    }

    // 🔍 filter
    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    // 📄 pagination
    qb.skip((page - 1) * pageSize).take(pageSize);

    // ⏬ sort
    qb.orderBy('order.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  // ✅ GET ONE (ownership)
  async findOne(
    id: number,
    userId: number,
    role: Role,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException(
        'You can only view your own orders',
      );
    }

    return order;
  }

  // ✅ UPDATE STATUS
  async updateStatus(
    id: number,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.CONFIRMED]: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const current = order.status;
    const next = dto.status;

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(
        `Cannot change status from ${current} to ${next}`,
      );
    }

    // 🔥 return stock if cancelled
    if (next === OrderStatus.CANCELLED) {
      for (const item of order.items) {
        item.product.stock += item.quantity;
        await this.productRepo.save(item.product);
      }
    }

    order.status = next;

    return this.orderRepo.save(order);
  }

  // ✅ DELETE
  async remove(id: number): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    await this.orderRepo.remove(order);
  }
}