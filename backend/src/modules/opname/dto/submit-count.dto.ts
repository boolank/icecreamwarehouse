import { IsNumber, IsNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CountItemDto {
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @IsNumber()
  @IsNotEmpty()
  physicalQtyBaseUom: number;
}

export class SubmitCountDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CountItemDto)
  items: CountItemDto[];
}

