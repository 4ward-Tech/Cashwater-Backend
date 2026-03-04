import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';
import { GeocodingService } from './geocoding.service';
export declare class DevicesService {
    private devicesRepository;
    private geocodingService;
    private readonly logger;
    constructor(devicesRepository: Repository<Device>, geocodingService: GeocodingService);
    generateRegistrationToken(): Promise<{
        registrationToken: string;
    }>;
    register(deviceId: string, ownerId?: string, name?: string, location?: string, latitude?: number, longitude?: number, type?: string): Promise<Device>;
    findAll(): Promise<Device[]>;
    findByOwner(ownerId: string): Promise<Device[]>;
    updateValveStatus(deviceId: string, isBlocked: boolean): Promise<Device>;
}
