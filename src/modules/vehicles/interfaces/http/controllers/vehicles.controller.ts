import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from '../../../application/dto/create-vehicle.dto';
import { CreateVehicleUseCase } from '../../../application/use-cases/create-vehicle.use-case';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly createVehicleUseCase: CreateVehicleUseCase) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: CreateVehicleDto })
    @ApiResponse({ status: 201, description: 'Vehicle created successfully.' })
    async create(@Body() body: CreateVehicleDto): Promise<{ id: string }> {
        return this.createVehicleUseCase.execute(body);
    }
}