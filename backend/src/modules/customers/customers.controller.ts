import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('customer-categories')
  async getCategories() {
    return this.customersService.findAllCategories();
  }

  @Get('customers')
  async getCustomers(
    @Query('search') search?: string,
    @Query('category_id') categoryId?: number,
  ) {
    return this.customersService.findAllCustomers(search, categoryId);
  }

  @Get('customers/:id')
  async getCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOneCustomer(id);
  }

  @Post('customers')
  @Roles('ADMIN_SISTEM', 'OPERATOR_OUTBOUND')
  async createCustomer(
    @Body() data: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.customersService.createCustomer(data, userId);
  }
}

