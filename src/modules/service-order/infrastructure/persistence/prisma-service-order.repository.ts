import { Injectable } from '@nestjs/common';
import { ServiceOrder } from '../../domain/entities/service-order.entity';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';

@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepository {
    async create(serviceOrder: ServiceOrder): Promise<ServiceOrder> {
        return serviceOrder;
    }

    async findById(id: string): Promise<ServiceOrder | null> {
        return null;
    }

    async findAll(): Promise<ServiceOrder[]> {
        return [];
    }
}