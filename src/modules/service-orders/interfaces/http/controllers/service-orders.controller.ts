import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateServiceOrderDto } from '../../../application/dto/create-service-order.dto';
import { RegisterDiagnosisDto } from '../../../application/dto/register-diagnosis.dto';
import { CreateServiceOrderUseCase } from '../../../application/use-cases/create-service-order.use-case';
import { DeliverServiceOrderUseCase } from '../../../application/use-cases/deliver-service-order.use-case';
import { FinishServiceOrderUseCase } from '../../../application/use-cases/finish-service-order.use-case';
import { GetServiceOrderUseCase } from '../../../application/use-cases/get-service-order.use-case';
import { RegisterDiagnosisUseCase } from '../../../application/use-cases/register-diagnosis.use-case';
import { SendBudgetForApprovalUseCase } from '../../../application/use-cases/send-budget-for-approval.use-case';
import { StartServiceOrderExecutionUseCase } from '../../../application/use-cases/start-service-order-execution.use-case';
import { AddServiceToServiceOrderDto } from '../../../application/dto/add-service-to-service-order.dto';
import { AddServiceToServiceOrderUseCase } from '../../../application/use-cases/add-service-to-service-order.use-case';
import { AddStockItemToServiceOrderDto } from '../../../application/dto/add-stock-item-to-service-order.dto';
import { AddStockItemToServiceOrderUseCase } from '../../../application/use-cases/add-stock-item-to-service-order.use-case';
import { ServiceOrderDetailsResponseDto } from '../../../application/dto/service-order-details-response.dto';

@ApiTags('service-orders')
@Controller('service-orders')
export class ServiceOrdersController {
    constructor(
        private readonly createServiceOrderUseCase: CreateServiceOrderUseCase,
        private readonly getServiceOrderUseCase: GetServiceOrderUseCase,
        private readonly registerDiagnosisUseCase: RegisterDiagnosisUseCase,
        private readonly sendBudgetForApprovalUseCase: SendBudgetForApprovalUseCase,
        private readonly startServiceOrderExecutionUseCase: StartServiceOrderExecutionUseCase,
        private readonly finishServiceOrderUseCase: FinishServiceOrderUseCase,
        private readonly deliverServiceOrderUseCase: DeliverServiceOrderUseCase,
        private readonly addServiceToServiceOrderUseCase: AddServiceToServiceOrderUseCase,
        private readonly addStockItemToServiceOrderUseCase: AddStockItemToServiceOrderUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new service order' })
    @ApiBody({ type: CreateServiceOrderDto })
    @ApiResponse({ status: 201, description: 'Service order created successfully.' })
    async create(@Body() body: CreateServiceOrderDto): Promise<{ id: string }> {
        return this.createServiceOrderUseCase.execute(body);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get service order by id with items' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiResponse({
        status: 200,
        description: 'Service order retrieved successfully.',
        type: ServiceOrderDetailsResponseDto,
    })
    async findById(@Param('id') id: string): Promise<ServiceOrderDetailsResponseDto> {
        return this.getServiceOrderUseCase.execute(id);
    }

    @Patch(':id/diagnosis')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Register diagnosis for a service order' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiBody({ type: RegisterDiagnosisDto })
    @ApiResponse({ status: 204, description: 'Diagnosis registered successfully.' })
    async registerDiagnosis(@Param('id') id: string, @Body() body: RegisterDiagnosisDto): Promise<void> {
        await this.registerDiagnosisUseCase.execute(id, body);
    }

    @Patch(':id/send-budget')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Send service order budget for customer approval' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiResponse({ status: 204, description: 'Budget sent for approval successfully.' })
    async sendBudget(@Param('id') id: string): Promise<void> {
        await this.sendBudgetForApprovalUseCase.execute(id);
    }

    @Patch(':id/start-execution')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Start service order execution' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiResponse({ status: 204, description: 'Service order execution started successfully.' })
    async startExecution(@Param('id') id: string): Promise<void> {
        await this.startServiceOrderExecutionUseCase.execute(id);
    }
    @Post(':id/services')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Add service to service order' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiBody({ type: AddServiceToServiceOrderDto })
    @ApiResponse({ status: 204, description: 'Service added to service order successfully.' })
    async addService(
        @Param('id') id: string,
        @Body() body: AddServiceToServiceOrderDto,
    ): Promise<void> {
        await this.addServiceToServiceOrderUseCase.execute(id, body);
    }

    @Patch(':id/finish')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Finish a service order' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiResponse({ status: 204, description: 'Service order finished successfully.' })
    async finish(@Param('id') id: string): Promise<void> {
        await this.finishServiceOrderUseCase.execute(id);
    }

    @Patch(':id/deliver')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Deliver a finished service order' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiResponse({ status: 204, description: 'Service order delivered successfully.' })
    async deliver(@Param('id') id: string): Promise<void> {
        await this.deliverServiceOrderUseCase.execute(id);
    }
    @Post(':id/stock-items')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Add stock item to service order and decrease stock' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Service order id (UUID)',
        example: 'e3b5c409-81d7-48df-8caf-627c467b8711',
    })
    @ApiBody({ type: AddStockItemToServiceOrderDto })
    @ApiResponse({ status: 204, description: 'Stock item added to service order successfully.' })
    async addStockItem(
        @Param('id') id: string,
        @Body() body: AddStockItemToServiceOrderDto,
    ): Promise<void> {
        await this.addStockItemToServiceOrderUseCase.execute(id, body);
    }


}