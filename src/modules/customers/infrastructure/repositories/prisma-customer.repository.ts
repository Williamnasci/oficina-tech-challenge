import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerDocument } from '../../domain/value-objects/customer-document.value-object';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(customer: Customer): Promise<void> {
        try {
            await this.prisma.customer.create({
                data: {
                    id: customer.id,
                    name: customer.name,
                    documentType: customer.document.type,
                    document: customer.document.value,
                    phone: customer.phone,
                    email: customer.email,
                    createdAt: customer.createdAt,
                    updatedAt: customer.updatedAt,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Document already registered.');
                }
            }

            throw error;
        }
    }

    async findById(id: string): Promise<Customer | null> {
        const data = await this.prisma.customer.findUnique({ where: { id } });

        if (!data) return null;

        return new Customer({
            id: data.id,
            name: data.name,
            document: new CustomerDocument(data.document, data.documentType as any),
            phone: data.phone,
            email: data.email,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }

    async findByDocument(document: string): Promise<Customer | null> {
        const normalizedDocument = document.replace(/\D/g, '');

        const data = await this.prisma.customer.findUnique({
            where: { document: normalizedDocument },
        });

        if (!data) return null;

        return new Customer({
            id: data.id,
            name: data.name,
            document: new CustomerDocument(data.document, data.documentType as any),
            phone: data.phone,
            email: data.email,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
}