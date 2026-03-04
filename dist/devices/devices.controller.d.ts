import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
export declare class DevicesController {
    private devicesService;
    constructor(devicesService: DevicesService);
    register(req: any, registerDeviceDto: RegisterDeviceDto): Promise<import("./entities/device.entity").Device>;
    generateQR(): Promise<{
        registrationToken: string;
    }>;
    findAll(req: any): Promise<import("./entities/device.entity").Device[]>;
    findMyDevices(req: any): Promise<import("./entities/device.entity").Device[]>;
    updateValve(id: string, body: {
        isBlocked: boolean;
    }): Promise<import("./entities/device.entity").Device>;
}
