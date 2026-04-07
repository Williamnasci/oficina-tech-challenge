import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateServiceOrderUseCase } from '../../application/use-cases/create-service-order.use-case';
import { ServiceOrderMapper } from '../../application/mappers/service-order.mapper';
import { CreateServiceOrderRequestDto } from '../dto/create-service-order-request.dto';

@Controller('service-orders')
export class ServiceOrderController {
    constructor(
        private readonly createServiceOrderUseCase: CreateServiceOrderUseCase,
    ) { }

    @Post()
    async create(@Body() body: CreateServiceOrderRequestDto) {
        const serviceOrder = await this.createServiceOrderUseCase.execute(body);
        return ServiceOrderMapper.toResponseDto(serviceOrder);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return { message: 'implementar busca por id' };
    }

    @Get()
    async findAll() {
        return { message: 'implementar listagem' };
    }
}