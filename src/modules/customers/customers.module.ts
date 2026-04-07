import { Module } from '@nestjs/common';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { CustomerRepository } from './domain/repositories/customer.repository';
import { PrismaCustomerRepository } from './infrastructure/repositories/prisma-customer.repository';
import { CustomersController } from './interfaces/http/controllers/customers.controller';

@Module({
    controllers: [CustomersController],
    providers: [
        CreateCustomerUseCase,
        {
            provide: CustomerRepository,
            useClass: PrismaCustomerRepository,
        },
    ],
    exports: [CustomerRepository],
})
export class CustomersModule { }