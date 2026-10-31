import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { OutboundService } from "./outbound.service";
import { CreateSalesOrderDto } from "./dto/create-sales-order.dto";
import { BreakdownUomDto } from "./dto/breakdown-uom.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("outbound")
@UseGuards(JwtAuthGuard, RolesGuard)
export class OutboundController {
  constructor(private readonly outboundService: OutboundService) {}

  @Post("so")
  @Roles("ADMIN_SISTEM", "STAF_PENJUALAN", "MANAJER_OPERASIONAL")
  async createSalesOrder(
    @Body() dto: CreateSalesOrderDto,
    @CurrentUser() user: any
  ) {
    return this.outboundService.createSalesOrder(dto, user?.userId);
  }

  @Get("so")
  async findAllSalesOrders() {
    return this.outboundService.findAllSalesOrders();
  }

  @Get("so/:id")
  async findSalesOrderById(@Param("id", ParseIntPipe) id: number) {
    return this.outboundService.findSalesOrderById(id);
  }

  @Patch("so/:id/confirm")
  @Roles("ADMIN_SISTEM", "MANAJER_OPERASIONAL")
  async confirmSalesOrder(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    return this.outboundService.confirmSalesOrder(id, user?.userId);
  }

  @Post("so/:id/picking-list")
  @Roles("ADMIN_SISTEM", "STAF_GUDANG", "MANAJER_OPERASIONAL")
  async generateFefoPickingList(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    return this.outboundService.generateFefoPickingList(id, user?.userId);
  }

  @Get("picking-lists")
  async findAllPickingLists() {
    return this.outboundService.findAllPickingLists();
  }

  @Patch("picking-lists/:id/complete")
  @Roles("ADMIN_SISTEM", "STAF_GUDANG", "MANAJER_OPERASIONAL")
  async completePicking(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    return this.outboundService.completePicking(id, user?.userId);
  }

  @Post("breakdown")
  @Roles("ADMIN_SISTEM", "STAF_GUDANG", "MANAJER_OPERASIONAL")
  async breakdownUom(
    @Body() dto: BreakdownUomDto,
    @CurrentUser() user: any
  ) {
    return this.outboundService.breakdownUom(dto, user?.userId);
  }
}
