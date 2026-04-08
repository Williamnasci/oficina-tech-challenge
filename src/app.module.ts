import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './modules/customers/customers.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ServiceOrdersModule } from './modules/service-orders/service-orders.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { StockItemsModule } from './modules/stock-items/stock-items.module';
import { ServiceCatalogModule } from './modules/service-catalog/service-catalog.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CustomersModule,
    VehiclesModule,
    ServiceOrdersModule,
    StockItemsModule,
    ServiceCatalogModule
  ],
})
export class AppModule { }