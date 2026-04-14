import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CreateTables1700000001CreateTables } from './migrations/1700000001-CreateTables';
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
CategoriesModule,
ProductsModule,
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST!,
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      username: process.env.POSTGRES_USER!,
      password: process.env.POSTGRES_PASSWORD!,
      database: process.env.POSTGRES_DB!,

      entities: [Category, Product],

      synchronize: false,

      migrationsRun: true,

      migrations: [CreateTables1700000001CreateTables],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}