import { ServiceOrder } from '../entities/service-order.entity';

export abstract class ServiceOrderRepository {
    abstract create(serviceOrder: ServiceOrder): Promise<void>;
    abstract findById(id: string): Promise<ServiceOrder | null>;
    abstract findDetailsById(id: string): Promise<any | null>;
    abstract findAll(): Promise<ServiceOrder[]>;
    abstract update(serviceOrder: ServiceOrder): Promise<void>;
    abstract addServiceToOrder(serviceOrderId: string, serviceId: string, quantity: number): Promise<void>;
    abstract addStockItemToOrder(serviceOrderId: string, stockItemId: string, quantity: number): Promise<void>;
}