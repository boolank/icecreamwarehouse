import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, ProductUomDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category_id') categoryId?: number,
  ) {
    return this.productsService.findAll(search, categoryId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get(':id/audit-logs')
  async getAuditLogs(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getAuditLogs(id);
  }

  @Post()
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.productsService.create(dto, userId);
  }

  @Put(':id')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.productsService.update(id, dto, userId);
  }

  @Put(':id/uoms')
  @Roles('ADMIN_SISTEM', 'MANAJER_GUDANG')
  async updateUoms(
    @Param('id', ParseIntPipe) id: number,
    @Body() uoms: ProductUomDto[],
    @CurrentUser('id') userId: number,
  ) {
    return this.productsService.updateUoms(id, uoms, userId);
  }

  @Delete(':id')
  @Roles('ADMIN_SISTEM')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.productsService.softDelete(id, userId);
  }
}

