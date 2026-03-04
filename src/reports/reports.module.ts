import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { DevicesModule } from '../devices/devices.module';
import { GeocodingService } from '../devices/geocoding.service';
import { LocationCache } from '../devices/entities/location-cache.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report, LocationCache]), DevicesModule],
    providers: [ReportsService, GeocodingService],
    controllers: [ReportsController],
    exports: [ReportsService],
})
export class ReportsModule { }
