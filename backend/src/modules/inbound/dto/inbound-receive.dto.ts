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

export class InboundReceiveItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  poItemId: number;

  @IsNotEmpty()
  @IsString()
  batchNumber: string;

  @IsOptional()
  @IsString()
  productionDate?: string;

  @IsNotEmpty()
  @IsString()
  expiredDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  receivedQty: number;

  @IsNotEmpty()
  @IsNumber()
  inputUomId: number;

  @IsNotEmpty()
  @IsNumber()
  freezerLocationId: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class InboundReceiveDto {
  @IsNotEmpty()
  @IsNumber()
  poId: number;

  @IsNotEmpty()
  @IsNumber()
  truckTemperature: number; // Suhu (°C) truk kedatangan, wajib ≤ -18°C

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InboundReceiveItemDto)
  items: InboundReceiveItemDto[];
}

