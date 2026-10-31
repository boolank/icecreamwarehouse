import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from "class-validator";

export class BreakdownUomDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  batchId: number;

  @IsNotEmpty()
  @IsNumber()
  fromFreezerLocationId: number;

  @IsNotEmpty()
  @IsNumber()
  toFreezerLocationId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  breakdownQuantity: number; // e.g. 2 Dus

  @IsNotEmpty()
  @IsNumber()
  sourceUomId: number; // e.g. ID of 'DUS'

  @IsOptional()
  @IsString()
  notes?: string;
}
