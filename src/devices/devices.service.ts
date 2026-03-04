import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device, DeviceStatus } from './entities/device.entity';
import * as crypto from 'crypto';
import { GeocodingService } from './geocoding.service';

@Injectable()
export class DevicesService {
    private readonly logger = new Logger(DevicesService.name);

    constructor(
        @InjectRepository(Device)
        private devicesRepository: Repository<Device>,
        private geocodingService: GeocodingService,
    ) { }

    async generateRegistrationToken(): Promise<{ registrationToken: string }> {
        const token = `CW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        return { registrationToken: token };
    }

    async register(
        deviceId: string,
        ownerId?: string,
        name?: string,
        location?: string,
        latitude?: number,
        longitude?: number,
        type?: string
    ): Promise<Device> {
        let resolvedLocation = location;

        // If coordinates provided and location is missing or default, resolve it
        if (latitude && longitude && (!location || location === 'Default')) {
            resolvedLocation = await this.geocodingService.reverseGeocode(latitude, longitude);
        }

        const existingDevice = await this.devicesRepository.findOne({ where: { id: deviceId } });

        if (existingDevice && existingDevice.ownerId) {
            throw new ConflictException('Device is already registered to another user');
        }

        if (existingDevice) {
            if (ownerId) existingDevice.ownerId = ownerId;
            existingDevice.name = name || existingDevice.name;
            existingDevice.location = resolvedLocation || existingDevice.location;
            if (latitude !== undefined) existingDevice.latitude = latitude;
            if (longitude !== undefined) existingDevice.longitude = longitude;
            if (type !== undefined) existingDevice.type = type as any;
            existingDevice.status = DeviceStatus.ACTIVE;
            existingDevice.lastActivity = new Date();
            return this.devicesRepository.save(existingDevice);
        }

        const device = this.devicesRepository.create({
            id: deviceId,
            ownerId,
            name: name || `Device ${deviceId.substring(0, 4)}`,
            location: resolvedLocation || 'Default',
            latitude,
            longitude,
            type: type as any,
            status: DeviceStatus.ACTIVE,
            lastActivity: new Date(),
        });

        return this.devicesRepository.save(device);
    }

    async findAll(): Promise<Device[]> {
        return this.devicesRepository.find({ relations: ['owner'] });
    }

    async findByOwner(ownerId: string): Promise<Device[]> {
        return this.devicesRepository.find({ where: { ownerId } });
    }

    async updateValveStatus(deviceId: string, isBlocked: boolean): Promise<Device> {
        const device = await this.devicesRepository.findOne({ where: { id: deviceId } });
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        device.isValveBlocked = isBlocked;
        device.status = isBlocked ? DeviceStatus.CUTOFF : DeviceStatus.ACTIVE;
        return this.devicesRepository.save(device);
    }
}
