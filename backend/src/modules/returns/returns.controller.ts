import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { ReturnsService } from "./returns.service";
import { CreateReturnOrderDto } from "./dto/create-return-order.dto";
import { DisposeReturnOrderDto } from "./dto/dispose-return-order.dto";

@Controller("api/v1/returns")
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  async createCustomerReturn(@Body() dto: CreateReturnOrderDto) {
    return this.returnsService.createCustomerReturn(dto);
  }

  @Get()
  async findAll() {
    return this.returnsService.findAll();
  }

  @Get("quarantine-stocks")
  async getQuarantineStocks() {
    return this.returnsService.getQuarantineInventory();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.returnsService.findOne(id);
  }

  @Patch(":id/dispose")
  async disposeReturn(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DisposeReturnOrderDto
  ) {
    return this.returnsService.disposeReturn(id, dto);
  }
}
