import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';
import { Order } from './schemas/orders.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() request: CreateOrderDto): Promise<Order> {
    return this.ordersService.createOrder(request);
  }

  @Get(':id')
  getOrder(@Param('id') id: string): Promise<Order> {
    return this.ordersService.getOrder(id);
  }

  @Get()
  getOrders(): Promise<Order[]> {
    return this.ordersService.getOrders();
  }
}
