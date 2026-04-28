import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 16',
    description: 'Product name',
    maxLength: 255,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 999.99,
    description: 'Product price',
  })
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiPropertyOptional({
    example: 'Flagship smartphone',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Stock quantity',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Category ID',
  })
  @IsOptional()
  @IsInt()
  categoryId?: number;
}