import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from "class-validator";

export class CreateOpnameDto {
  @IsString()
  @IsNotEmpty()
  opnameDate: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  freezerLocationIds?: number[]; // Jika kosong, opname mencakup semua rak freezer aktif
}

