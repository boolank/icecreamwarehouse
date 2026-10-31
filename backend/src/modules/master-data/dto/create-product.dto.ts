import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductUomDto {
  @IsNotEmpty({ message: 'Nama UOM wajib diisi' })
  @IsString()
  uom_name: string; // 'DUS', 'PACK', 'PCS'

  @IsNotEmpty({ message: 'Faktor konversi wajib diisi' })
  @IsNumber()
  @Min(1, { message: 'Faktor konversi minimal 1' })
  conversion_factor: number;

  @IsOptional()
  is_base_uom?: boolean;

  @IsOptional()
  is_buying_uom?: boolean;

  @IsOptional()
  is_selling_uom?: boolean;
}

export class CreateProductDto {
  @IsNotEmpty({ message: 'Kode SKU wajib diisi' })
  @IsString()
  sku: string;

  @IsNotEmpty({ message: 'Nama produk es krim wajib diisi' })
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(-40)
  @Max(0)
  min_temp?: number; // default -25.0

  @IsOptional()
  @IsNumber()
  @Min(-40)
  @Max(0)
  max_temp?: number; // default -18.0

  @IsOptional()
  @IsNumber()
  shelf_life_days?: number;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsArray({ message: 'Hierarki UOM harus berupa array' })
  @ValidateNested({ each: true })
  @Type(() => ProductUomDto)
  uoms: ProductUomDto[];
}

