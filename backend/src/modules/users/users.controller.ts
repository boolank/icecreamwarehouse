import {
  Controller,
  Get,
  Post,
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
  @Roles('ADMIN_SISTEM')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @Roles('ADMIN_SISTEM')
  async findAllRoles() {
    return this.usersService.findAllRoles();
  }

  @Get('users/:id')
  @Roles('ADMIN_SISTEM')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('users')
  @Roles('ADMIN_SISTEM')
  async create(@Body() body: any, @CurrentUser('id') currentUserId: number) {
    return this.usersService.createUser(body, currentUserId);
  }
}

