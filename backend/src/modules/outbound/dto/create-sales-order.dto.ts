import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateSalesOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  productUomId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  orderedQty: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPct?: number;
}

export class CreateSalesOrderDto {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsString()
  requestedDate?: string;

  @IsOptional()
  @IsString()
  paymentType?: "CASH" | "CREDIT";

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderItemDto)
  items: CreateSalesOrderItemDto[];
}

