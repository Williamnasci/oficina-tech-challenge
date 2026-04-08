import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../../application/dto/create-customer.dto';
import { CreateCustomerUseCase } from '../../../application/use-cases/create-customer.use-case';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
    constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: CreateCustomerDto })
    @ApiResponse({ status: 201, description: 'Customer created successfully.' })
    async create(@Body() body: CreateCustomerDto): Promise<{ id: string }> {
        return this.createCustomerUseCase.execute(body);
    }
}