import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prices')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  async findAll(
    @Query('product_id') productId?: number,
    @Query('category_id') categoryId?: number,
  ) {
    return this.pricingService.findAll(productId, categoryId);
  }

  @Get('lookup')
  async lookup(
    @Query('product_id', ParseIntPipe) productId: number,
    @Query('uom_id', ParseIntPipe) uomId: number,
    @Query('category_id', ParseIntPipe) categoryId: number,
  ) {
    return this.pricingService.lookupPrice(productId, uomId, categoryId);
  }

  @Post()
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async setPrice(
    @Body() body: { product_id: number; product_uom_id: number; category_id: number; price: number },
    @CurrentUser('id') userId: number,
  ) {
    return this.pricingService.setPrice(
      body.product_id,
      body.product_uom_id,
      body.category_id,
      body.price,
      userId,
    );
  }
}

