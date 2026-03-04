"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./entities/report.entity");
const geocoding_service_1 = require("../devices/geocoding.service");
const devices_service_1 = require("../devices/devices.service");
let ReportsService = ReportsService_1 = class ReportsService {
    reportsRepository;
    geocodingService;
    devicesService;
    logger = new common_1.Logger(ReportsService_1.name);
    constructor(reportsRepository, geocodingService, devicesService) {
        this.reportsRepository = reportsRepository;
        this.geocodingService = geocodingService;
        this.devicesService = devicesService;
    }
    async create(dto) {
        let location;
        if (dto.latitude && dto.longitude) {
            try {
                location = await this.geocodingService.reverseGeocode(dto.latitude, dto.longitude);
            }
            catch (e) {
                this.logger.warn(`Could not geocode report location: ${e.message}`);
            }
        }
        if (!location) {
            try {
                const devices = await this.devicesService.findAll();
                const device = devices.find((d) => d.id === dto.deviceId);
                location = device?.location || 'Unknown Location';
            }
            catch {
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
    async findAll() {
        return this.reportsRepository.find({
            order: { createdAt: 'DESC' },
            relations: ['device', 'device.owner'],
        });
    }
    async findOne(id) {
        const report = await this.reportsRepository.findOne({
            where: { id },
            relations: ['device', 'device.owner'],
        });
        if (!report)
            throw new common_1.NotFoundException(`Report ${id} not found`);
        return report;
    }
    async updateStatus(id, dto) {
        const report = await this.findOne(id);
        report.status = dto.status;
        if (dto.status !== report_entity_1.ReportStatus.NEW) {
            report.resolvedAt = new Date();
        }
        return this.reportsRepository.save(report);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        geocoding_service_1.GeocodingService,
        devices_service_1.DevicesService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map