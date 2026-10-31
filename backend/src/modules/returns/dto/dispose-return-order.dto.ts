import { IsString, IsNotEmpty, IsIn, IsOptional, IsNumber } from "class-validator";

export class DisposeReturnOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["WRITE_OFF", "RESTOCK", "RETURN_TO_SUPPLIER"])
  disposition: "WRITE_OFF" | "RESTOCK" | "RETURN_TO_SUPPLIER";

  @IsString()
  @IsNotEmpty()
  dispositionNotes: string;

  @IsNumber()
  @IsOptional()
  targetFreezerLocationId?: number; // Digunakan jika RESTOCK kembali ke rak aktif reguler
}
