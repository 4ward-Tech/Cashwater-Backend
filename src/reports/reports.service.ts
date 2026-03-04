import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { GeocodingService } from '../devices/geocoding.service';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class ReportsService {
    private readonly logger = new Logger(ReportsService.name);

    constructor(
        @InjectRepository(Report)
        private reportsRepository: Repository<Report>,
        private geocodingService: GeocodingService,
        private devicesService: DevicesService,
    ) { }

    async create(dto: CreateReportDto): Promise<Report> {
        // Resolve a human-readable location from coordinates if available
        let location: string | undefined;
        if (dto.latitude && dto.longitude) {
            try {
                location = await this.geocodingService.reverseGeocode(dto.latitude, dto.longitude);
            } catch (e) {
                this.logger.warn(`Could not geocode report location: ${e.message}`);
            }
        }

        // Fallback: use the device's stored location
        if (!location) {
            try {
                const devices = await this.devicesService.findAll();
                const device = devices.find((d) => d.id === dto.deviceId);
                location = device?.location || 'Unknown Location';
            } catch {
                location = 'Unknown Location';
            }
        }

        const report = this.reportsRepository.create({
            ...dto,
            location,
        });

        const saved = await this.reportsRepository.save(report);
        this.logger.log(`New report created: ${saved.id} for device ${saved.deviceId} (${saved.severity})`);
        return saved;
    }

    async findAll(): Promise<Report[]> {
        return this.reportsRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['device', 'device.owner'],
        });
    }

    async findOne(id: string): Promise<Report> {
        const report = await this.reportsRepository.findOne({
            where: { id },
            relations: ['device', 'device.owner'],
        });
        if (!report) throw new NotFoundException(`Report ${id} not found`);
        return report;
    }

    async updateStatus(id: string, dto: UpdateReportStatusDto): Promise<Report> {
        const report = await this.findOne(id);
        report.status = dto.status;
        if (dto.status !== ReportStatus.NEW) {
            report.resolvedAt = new Date();
        }
        return this.reportsRepository.save(report);
    }
}
