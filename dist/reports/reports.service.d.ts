import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { GeocodingService } from '../devices/geocoding.service';
import { DevicesService } from '../devices/devices.service';
export declare class ReportsService {
    private reportsRepository;
    private geocodingService;
    private devicesService;
    private readonly logger;
    constructor(reportsRepository: Repository<Report>, geocodingService: GeocodingService, devicesService: DevicesService);
    create(dto: CreateReportDto): Promise<Report>;
    findAll(): Promise<Report[]>;
    findOne(id: string): Promise<Report>;
    updateStatus(id: string, dto: UpdateReportStatusDto): Promise<Report>;
}
