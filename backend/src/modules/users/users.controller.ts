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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async findAllRoles() {
    return this.usersService.findAllRoles();
  }

  @Get('users/:id')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('users/:id/audit-logs')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async getAuditLogs(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getAuditLogs(id);
  }

  @Post('users')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async create(@Body() body: any, @CurrentUser('id') currentUserId: number) {
    return this.usersService.createUser(body, currentUserId);
  }

  @Put('users/:id')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.usersService.updateUser(id, body, currentUserId);
  }

  @Patch('users/:id/toggle-status')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.usersService.toggleStatus(id, currentUserId);
  }

  @Post('users/:id/reset-password')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('new_password') newPassword: string,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.usersService.resetPassword(id, newPassword, currentUserId);
  }
}
