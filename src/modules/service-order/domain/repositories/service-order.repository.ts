import { ServiceOrder } from '../entities/service-order.entity';

export abstract class ServiceOrderRepository {
    abstract create(serviceOrder: ServiceOrder): Promise<ServiceOrder>;
    abstract findById(id: string): Promise<ServiceOrder | null>;
    abstract findAll(): Promise<ServiceOrder[]>;
}