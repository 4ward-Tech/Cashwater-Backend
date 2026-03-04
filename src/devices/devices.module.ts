import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { GeocodingService } from './geocoding.service';
import { LocationCache } from './entities/location-cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, LocationCache])],
  providers: [DevicesService, GeocodingService],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule { }
