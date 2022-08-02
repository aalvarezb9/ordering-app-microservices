import { Inject, Injectable } from '@nestjs/common';
import { BILLING_SERVICE } from './constants/services.constant';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersRepository } from './repositories/orders.repository';
import { Order } from './schemas/orders.schema';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private readonly billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderDto): Promise<Order> {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrder(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ _id: id });
    return order;
  }

  async getOrders(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({});
    return orders;
  }
}
