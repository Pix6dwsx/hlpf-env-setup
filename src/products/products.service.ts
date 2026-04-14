import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async create(data: any) {
    const product = this.repo.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock ?? 0,
      category: data.categoryId
        ? { id: data.categoryId }
        : null,
    } as any);

    return this.repo.save(product);
  }

  async update(id: number, data: any) {
    const product = await this.findOne(id);

    Object.assign(product, data);

    if (data.categoryId !== undefined) {
      product.category = { id: data.categoryId } as any;
    }

    return this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
  }
}