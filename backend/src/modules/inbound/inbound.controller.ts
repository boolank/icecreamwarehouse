import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { InboundService } from "./inbound.service";
import { CreatePoDto } from "./dto/create-po.dto";
import { InboundReceiveDto } from "./dto/inbound-receive.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("inbound")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InboundController {
  constructor(private readonly inboundService: InboundService) {}

  @Post("po")
  @Roles("ADMIN_SISTEM", "STAF_GUDANG", "MANAJER_OPERASIONAL")
  async createPo(@Body() dto: CreatePoDto, @CurrentUser() user: any) {
    return this.inboundService.createPo(dto, user?.userId);
  }

  @Get("po")
  async findAllPo() {
    return this.inboundService.findAllPo();
  }

  @Get("po/:id")
  async findPoById(@Param("id", ParseIntPipe) id: number) {
    return this.inboundService.findPoById(id);
  }

  @Patch("po/:id/confirm")
  @Roles("ADMIN_SISTEM", "MANAJER_OPERASIONAL")
  async confirmPo(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    return this.inboundService.confirmPo(id, user?.userId);
  }

  @Post("receive")
  @Roles("ADMIN_SISTEM", "STAF_GUDANG", "MANAJER_OPERASIONAL")
  async receiveInbound(
    @Body() dto: InboundReceiveDto,
    @CurrentUser() user: any
  ) {
    return this.inboundService.receiveInbound(dto, user?.userId);
  }

  @Post("temperature-logs")
  async logTemperature(
    @Body()
    body: {
      freezerLocationId: number;
      temperatureCelsius: number;
      notes?: string;
    },
    @CurrentUser() user: any
  ) {
    return this.inboundService.logTemperature({
      ...body,
      userId: user?.userId,
    });
  }

  @Get("temperature-logs")
  async getTemperatureLogs(@Query("freezerId") freezerId?: number) {
    return this.inboundService.getTemperatureLogs(
      freezerId ? Number(freezerId) : undefined
    );
  }
}

