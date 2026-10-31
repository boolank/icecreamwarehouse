import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FreezersService } from './freezers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('freezer-locations')
export class FreezersController {
  constructor(private readonly freezersService: FreezersService) {}

  @Get()
  async findAll() {
    return this.freezersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.freezersService.findOne(id);
  }

  @Get(':id/audit-logs')
  async getAuditLogs(@Param('id', ParseIntPipe) id: number) {
    return this.freezersService.getAuditLogs(id);
  }

  @Post()
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async create(@Body() data: any, @CurrentUser('id') userId: number) {
    return this.freezersService.create(data, userId);
  }

  @Put(':id')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.freezersService.update(id, data, userId);
  }

  @Patch(':id/toggle-status')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.freezersService.toggleStatus(id, userId);
  }
}
