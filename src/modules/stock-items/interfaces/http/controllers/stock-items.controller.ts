import {
    Body,
    Controller,
    Delete,
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
import { CreateStockItemDto } from '../../../application/dto/create-stock-item.dto';
import { StockItemResponseDto } from '../../../application/dto/stock-item-response.dto';
import { UpdateStockItemDto } from '../../../application/dto/update-stock-item.dto';
import { CreateStockItemUseCase } from '../../../application/use-cases/create-stock-item.use-case';
import { DeleteStockItemUseCase } from '../../../application/use-cases/delete-stock-item.use-case';
import { GetStockItemUseCase } from '../../../application/use-cases/get-stock-item.use-case';
import { ListStockItemsUseCase } from '../../../application/use-cases/list-stock-items.use-case';
import { UpdateStockItemUseCase } from '../../../application/use-cases/update-stock-item.use-case';

@ApiTags('stock-items')
@Controller('stock-items')
export class StockItemsController {
    constructor(
        private readonly createStockItemUseCase: CreateStockItemUseCase,
        private readonly getStockItemUseCase: GetStockItemUseCase,
        private readonly listStockItemsUseCase: ListStockItemsUseCase,
        private readonly updateStockItemUseCase: UpdateStockItemUseCase,
        private readonly deleteStockItemUseCase: DeleteStockItemUseCase,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new stock item' })
    @ApiBody({ type: CreateStockItemDto })
    @ApiResponse({ status: 201, description: 'Stock item created successfully.' })
    async create(@Body() body: CreateStockItemDto): Promise<{ id: string }> {
        return this.createStockItemUseCase.execute(body);
    }

    @Get()
    @ApiOperation({ summary: 'List all stock items' })
    @ApiResponse({
        status: 200,
        description: 'Stock items retrieved successfully.',
        type: [StockItemResponseDto],
    })
    async findAll(): Promise<StockItemResponseDto[]> {
        return this.listStockItemsUseCase.execute();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get stock item by id' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Stock item id (UUID)',
    })
    @ApiResponse({
        status: 200,
        description: 'Stock item retrieved successfully.',
        type: StockItemResponseDto,
    })
    async findById(@Param('id') id: string): Promise<StockItemResponseDto> {
        return this.getStockItemUseCase.execute(id);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Update stock item' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Stock item id (UUID)',
    })
    @ApiBody({ type: UpdateStockItemDto })
    @ApiResponse({ status: 204, description: 'Stock item updated successfully.' })
    async update(@Param('id') id: string, @Body() body: UpdateStockItemDto): Promise<void> {
        await this.updateStockItemUseCase.execute(id, body);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete (deactivate) stock item' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Stock item id (UUID)',
    })
    @ApiResponse({ status: 204, description: 'Stock item deleted successfully.' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteStockItemUseCase.execute(id);
    }
}