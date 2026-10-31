import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateReturnOrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  batchId: number;

  @IsNumber()
  @IsOptional()
  freezerLocationId?: number; // Optional, default to quarantine location

  @IsNumber()
  @IsNotEmpty()
  returnQtyBaseUom: number;

  @IsString()
  @IsIn(["DAMAGED", "MELTED", "NEAR_EXPIRED", "WRONG_ITEM", "GOOD"])
  condition: "DAMAGED" | "MELTED" | "NEAR_EXPIRED" | "WRONG_ITEM" | "GOOD";
}

export class CreateReturnOrderDto {
  @IsString()
  @IsIn(["CUSTOMER_RETURN", "SUPPLIER_CLAIM"])
  returnType: "CUSTOMER_RETURN" | "SUPPLIER_CLAIM";

  @IsNumber()
  @IsOptional()
  soId?: number;

  @IsNumber()
  @IsOptional()
  customerId?: number;

  @IsNumber()
  @IsOptional()
  supplierId?: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnOrderItemDto)
  items: CreateReturnOrderItemDto[];
}
