import { ServiceOrder } from '../entities/service-order.entity';
import { ServiceOrderDetailsResponseDto } from '../../application/dto/service-order-details-response.dto';

export abstract class ServiceOrderRepository {
    abstract create(serviceOrder: ServiceOrder): Promise<void>;
    abstract findById(id: string): Promise<ServiceOrder | null>;
    abstract findDetailsById(id: string): Promise<ServiceOrderDetailsResponseDto | null>;
    abstract findAll(): Promise<ServiceOrder[]>;
    abstract findOperationalQueue(): Promise<ServiceOrder[]>;
    abstract findByCustomerId(customerId: string): Promise<ServiceOrder[]>;
    abstract getAverageExecutionTimeInMinutes(): Promise<number>;
    abstract update(serviceOrder: ServiceOrder): Promise<void>;
    abstract addServiceToOrder(serviceOrderId: string, serviceId: string, quantity: number): Promise<void>;
    abstract addStockItemToOrder(serviceOrderId: string, stockItemId: string, quantity: number): Promise<void>;
}
