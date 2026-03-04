"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DevicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("./entities/device.entity");
const crypto = __importStar(require("crypto"));
const geocoding_service_1 = require("./geocoding.service");
let DevicesService = DevicesService_1 = class DevicesService {
    devicesRepository;
    geocodingService;
    logger = new common_1.Logger(DevicesService_1.name);
    constructor(devicesRepository, geocodingService) {
        this.devicesRepository = devicesRepository;
        this.geocodingService = geocodingService;
    }
    async generateRegistrationToken() {
        const token = `CW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        return { registrationToken: token };
    }
    async register(deviceId, ownerId, name, location, latitude, longitude, type) {
        let resolvedLocation = location;
        if (latitude && longitude && (!location || location === 'Default')) {
            resolvedLocation = await this.geocodingService.reverseGeocode(latitude, longitude);
        }
        const existingDevice = await this.devicesRepository.findOne({ where: { id: deviceId } });
        if (existingDevice && existingDevice.ownerId) {
            throw new common_1.ConflictException('Device is already registered to another user');
        }
        if (existingDevice) {
            if (ownerId)
                existingDevice.ownerId = ownerId;
            existingDevice.name = name || existingDevice.name;
            existingDevice.location = resolvedLocation || existingDevice.location;
            if (latitude !== undefined)
                existingDevice.latitude = latitude;
            if (longitude !== undefined)
                existingDevice.longitude = longitude;
            if (type !== undefined)
                existingDevice.type = type;
            existingDevice.status = device_entity_1.DeviceStatus.ACTIVE;
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
            type: type,
            status: device_entity_1.DeviceStatus.ACTIVE,
            lastActivity: new Date(),
        });
        return this.devicesRepository.save(device);
    }
    async findAll() {
        return this.devicesRepository.find({ relations: ['owner'] });
    }
    async findByOwner(ownerId) {
        return this.devicesRepository.find({ where: { ownerId } });
    }
    async updateValveStatus(deviceId, isBlocked) {
        const device = await this.devicesRepository.findOne({ where: { id: deviceId } });
        if (!device) {
            throw new common_1.NotFoundException('Device not found');
        }
        device.isValveBlocked = isBlocked;
        device.status = isBlocked ? device_entity_1.DeviceStatus.CUTOFF : device_entity_1.DeviceStatus.ACTIVE;
        return this.devicesRepository.save(device);
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = DevicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        geocoding_service_1.GeocodingService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map