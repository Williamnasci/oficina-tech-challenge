import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { ServiceOrder } from '../../domain/entities/service-order.entity';
import { ServiceOrderStatus } from '../../domain/enums/service-order-status.enum';
import { ServiceOrderRepository } from '../../domain/repositories/service-order.repository';
import { ServiceOrderDetailsResponseDto } from '../../application/dto/service-order-details-response.dto';

@Injectable()
export class PrismaServiceOrderRepository implements ServiceOrderRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(order: ServiceOrder): Promise<void> {
        try {
            await this.prisma.serviceOrder.create({
                data: {
                    id: order.id,
                    customerId: order.customerId,
                    vehicleId: order.vehicleId,
                    status: order.status,
                    diagnosis: order.diagnosis,
                    servicesAmount: order.servicesAmount,
                    stockItemsAmount: order.stockItemsAmount,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt,
                    startedAt: order.startedAt,
                    finishedAt: order.finishedAt,
                    deliveredAt: order.deliveredAt,
                    updatedAt: order.updatedAt,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new NotFoundException('Customer or vehicle not found.');
                }
            }

            throw error;
        }
    }

    async findById(id: string): Promise<ServiceOrder | null> {
        const data = await this.prisma.serviceOrder.findUnique({ where: { id } });

        if (!data) return null;

        return this.toDomain(data);
    }

    async findAll(): Promise<ServiceOrder[]> {
        const data = await this.prisma.serviceOrder.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async findByCustomerId(customerId: string): Promise<ServiceOrder[]> {
        const data = await this.prisma.serviceOrder.findMany({
            where: { customerId },
            orderBy: { createdAt: 'desc' },
        });

        return data.map((item) => this.toDomain(item));
    }

    async update(order: ServiceOrder): Promise<void> {
        try {
            await this.prisma.serviceOrder.update({
                where: { id: order.id },
                data: {
                    status: order.status,
                    diagnosis: order.diagnosis,
                    servicesAmount: order.servicesAmount,
                    stockItemsAmount: order.stockItemsAmount,
                    totalAmount: order.totalAmount,
                    startedAt: order.startedAt,
                    finishedAt: order.finishedAt,
                    deliveredAt: order.deliveredAt,
                    updatedAt: order.updatedAt,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Service order not found.');
                }
            }

            throw error;
        }
    }

    async addServiceToOrder(serviceOrderId: string, serviceId: string, quantity: number): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const order = await tx.serviceOrder.findUnique({
                where: { id: serviceOrderId },
            });

            if (!order) {
                throw new NotFoundException('Service order not found.');
            }

            const service = await tx.serviceCatalog.findUnique({
                where: { id: serviceId },
            });

            if (!service || !service.isActive) {
                throw new NotFoundException('Service not found.');
            }

            const existingItem = await tx.serviceOrderService.findFirst({
                where: {
                    serviceOrderId,
                    serviceId,
                },
            });

            const unitPrice = Number(service.price);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                const newTotalPrice = unitPrice * newQuantity;

                await tx.serviceOrderService.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: newQuantity,
                        unitPrice,
                        totalPrice: newTotalPrice,
                    },
                });
            } else {
                await tx.serviceOrderService.create({
                    data: {
                        serviceOrderId,
                        serviceId,
                        quantity,
                        unitPrice,
                        totalPrice: unitPrice * quantity,
                    },
                });
            }

            const serviceItems = await tx.serviceOrderService.findMany({
                where: { serviceOrderId },
            });

            const servicesAmount = serviceItems.reduce(
                (sum, item) => sum + Number(item.totalPrice),
                0,
            );

            // Use domain entity for recalculation
            const domainOrder = this.toDomain(order);
            domainOrder.updateServicesAmount(servicesAmount);

            await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: {
                    servicesAmount: domainOrder.servicesAmount,
                    totalAmount: domainOrder.totalAmount,
                    updatedAt: domainOrder.updatedAt,
                },
            });
        });
    }

    async findDetailsById(id: string): Promise<ServiceOrderDetailsResponseDto | null> {
        const data = await this.prisma.serviceOrder.findUnique({
            where: { id },
            include: {
                services: {
                    include: {
                        service: true,
                    },
                },
                stockItems: {
                    include: {
                        stockItem: true,
                    },
                },
            },
        });

        if (!data) return null;

        return {
            id: data.id,
            customerId: data.customerId,
            vehicleId: data.vehicleId,
            status: data.status as ServiceOrderStatus,
            diagnosis: data.diagnosis,
            servicesAmount: Number(data.servicesAmount),
            stockItemsAmount: Number(data.stockItemsAmount),
            totalAmount: Number(data.totalAmount),
            createdAt: data.createdAt,
            startedAt: data.startedAt,
            finishedAt: data.finishedAt,
            deliveredAt: data.deliveredAt,
            updatedAt: data.updatedAt,
            services: data.services.map((item) => ({
                id: item.id,
                serviceId: item.serviceId,
                name: item.service.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.totalPrice),
            })),
            stockItems: data.stockItems.map((item) => ({
                id: item.id,
                stockItemId: item.stockItemId,
                name: item.stockItem.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.totalPrice),
            })),
        };
    }

    async addStockItemToOrder(serviceOrderId: string, stockItemId: string, quantity: number): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const order = await tx.serviceOrder.findUnique({
                where: { id: serviceOrderId },
            });

            if (!order) {
                throw new NotFoundException('Service order not found.');
            }

            const stockItem = await tx.stockItem.findUnique({
                where: { id: stockItemId },
            });

            if (!stockItem || !stockItem.isActive) {
                throw new NotFoundException('Stock item not found.');
            }

            if (stockItem.quantity < quantity) {
                throw new ConflictException('Insufficient stock quantity.');
            }

            const existingItem = await tx.serviceOrderStockItem.findFirst({
                where: {
                    serviceOrderId,
                    stockItemId,
                },
            });

            const unitPrice = Number(stockItem.unitPrice);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                const newTotalPrice = unitPrice * newQuantity;

                await tx.serviceOrderStockItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: newQuantity,
                        unitPrice,
                        totalPrice: newTotalPrice,
                    },
                });
            } else {
                await tx.serviceOrderStockItem.create({
                    data: {
                        serviceOrderId,
                        stockItemId,
                        quantity,
                        unitPrice,
                        totalPrice: unitPrice * quantity,
                    },
                });
            }

            await tx.stockItem.update({
                where: { id: stockItemId },
                data: {
                    quantity: stockItem.quantity - quantity,
                    updatedAt: new Date(),
                },
            });

            const stockItems = await tx.serviceOrderStockItem.findMany({
                where: { serviceOrderId },
            });

            const stockItemsAmount = stockItems.reduce(
                (sum, item) => sum + Number(item.totalPrice),
                0,
            );

            // Use domain entity for recalculation
            const domainOrder = this.toDomain(order);
            domainOrder.updateStockItemsAmount(stockItemsAmount);

            await tx.serviceOrder.update({
                where: { id: serviceOrderId },
                data: {
                    stockItemsAmount: domainOrder.stockItemsAmount,
                    totalAmount: domainOrder.totalAmount,
                    updatedAt: domainOrder.updatedAt,
                },
            });
        });
    }

    private toDomain(data: {
        id: string;
        customerId: string;
        vehicleId: string;
        status: string;
        diagnosis: string | null;
        servicesAmount: Prisma.Decimal | number;
        stockItemsAmount: Prisma.Decimal | number;
        totalAmount: Prisma.Decimal | number;
        createdAt: Date;
        startedAt: Date | null;
        finishedAt: Date | null;
        deliveredAt: Date | null;
        updatedAt: Date;
    }): ServiceOrder {
        return new ServiceOrder({
            id: data.id,
            customerId: data.customerId,
            vehicleId: data.vehicleId,
            status: data.status as ServiceOrderStatus,
            diagnosis: data.diagnosis,
            servicesAmount: Number(data.servicesAmount),
            stockItemsAmount: Number(data.stockItemsAmount),
            totalAmount: Number(data.totalAmount),
            createdAt: data.createdAt,
            startedAt: data.startedAt,
            finishedAt: data.finishedAt,
            deliveredAt: data.deliveredAt,
            updatedAt: data.updatedAt,
        });
    }
}