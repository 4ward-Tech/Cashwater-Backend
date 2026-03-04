import { Controller, Post, Get, Patch, Body, UseGuards, Request, Param, ForbiddenException } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Controller('devices')
export class DevicesController {
    constructor(private devicesService: DevicesService) { }

    @Post('register')
    async register(@Request() req: any, @Body() registerDeviceDto: RegisterDeviceDto) {
        // Use dummy-user-id if not authenticated, otherwise use the actual user
        const userId = req.user?.userId || null;
        return this.devicesService.register(
            registerDeviceDto.deviceId,
            userId,
            registerDeviceDto.name,
            registerDeviceDto.location,
            registerDeviceDto.latitude,
            registerDeviceDto.longitude,
            registerDeviceDto.type,
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('generate-qr')
    async generateQR() {
        return this.devicesService.generateRegistrationToken();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll(@Request() req: any) {
        return this.devicesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-devices')
    async findMyDevices(@Request() req: any) {
        return this.devicesService.findByOwner(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/valve')
    async updateValve(@Param('id') id: string, @Body() body: { isBlocked: boolean }) {
        return this.devicesService.updateValveStatus(id, body.isBlocked);
    }
}
