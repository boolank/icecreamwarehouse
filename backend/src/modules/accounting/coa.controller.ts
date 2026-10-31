import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CoaService } from './coa.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accounts')
export class CoaController {
  constructor(private readonly coaService: CoaService) {}

  @Get()
  async findAll(@Query('view') view?: string) {
    if (view === 'tree') {
      return this.coaService.findAllTree();
    }
    return this.coaService.findAllFlat();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coaService.findOne(id);
  }

  @Get(':id/audit-logs')
  async getAuditLogs(@Param('id', ParseIntPipe) id: number) {
    return this.coaService.getAuditLogs(id);
  }

  @Post()
  @Roles('ADMIN_SISTEM', 'STAF_FINANCE')
  async create(@Body() data: any, @CurrentUser('id') userId: number) {
    return this.coaService.create(data, userId);
  }

  @Put(':id')
  @Roles('ADMIN_SISTEM', 'STAF_FINANCE')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.coaService.update(id, data, userId);
  }

  @Patch(':id/toggle-status')
  @Roles('ADMIN_SISTEM', 'STAF_FINANCE')
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.coaService.toggleStatus(id, userId);
  }
}
