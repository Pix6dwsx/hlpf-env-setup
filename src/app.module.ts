import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { Product } from './products/product.entity';
import { Category } from './categories/category.entity';
import { User } from './users/user.entity';

import { CreateTables1700000001CreateTables } from './migrations/1700000001-CreateTables';
import { CreateUsers1777373555910 } from './migrations/1777373555910-CreateUsers';

@Module({
  imports: [
    
    ConfigModule.forRoot({ isGlobal: true }),

    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST!,
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      username: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DB!,

      entities: [Category, Product, User],

      synchronize: false,
      migrationsRun: true,

      migrations: [
        CreateTables1700000001CreateTables,
        CreateUsers1777373555910,
      ],
    }),

    
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}