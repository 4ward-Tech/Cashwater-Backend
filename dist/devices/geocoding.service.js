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
var GeocodingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_cache_entity_1 = require("./entities/location-cache.entity");
let GeocodingService = GeocodingService_1 = class GeocodingService {
    locationCacheRepository;
    logger = new common_1.Logger(GeocodingService_1.name);
    lastRequestTime = 0;
    minRequestInterval = 1000;
    processingQueue = Promise.resolve();
    constructor(locationCacheRepository) {
        this.locationCacheRepository = locationCacheRepository;
    }
    async reverseGeocode(latitude, longitude) {
        const lat = parseFloat(Number(latitude).toFixed(6));
        const lon = parseFloat(Number(longitude).toFixed(6));
        const cached = await this.locationCacheRepository.findOne({
            where: { latitude: lat, longitude: lon }
        });
        if (cached) {
            this.logger.log(`Cache hit for ${lat}, ${lon}: ${cached.displayName}`);
            return cached.displayName;
        }
        return this.processingQueue = this.processingQueue.then(async () => {
            const lateCached = await this.locationCacheRepository.findOne({
                where: { latitude: lat, longitude: lon }
            });
            if (lateCached)
                return lateCached.displayName;
            const now = Date.now();
            const wait = Math.max(0, this.minRequestInterval - (now - this.lastRequestTime));
            if (wait > 0) {
                await new Promise(resolve => setTimeout(resolve, wait));
            }
            try {
                this.logger.log(`Calling Nominatim API for: ${lat}, ${lon}`);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
                    headers: {
                        'User-Agent': 'WaterWalletApp/1.0 (contact@email.com)',
                    },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (!response.ok)
                    throw new Error(`Status ${response.status}`);
                const data = await response.json();
                this.lastRequestTime = Date.now();
                if (data && data.address) {
                    const road = data.address.road || '';
                    const suburb = data.address.suburb || data.address.village || data.address.town || data.address.neighbourhood || '';
                    const city = data.address.city || data.address.city_district || '';
                    const district = data.address.county || '';
                    const province = data.address.state || '';
                    const parts = [road, suburb, district].filter(p => p && p.length > 0);
                    const displayName = parts.length > 0 ? parts.join(', ') : data.display_name;
                    try {
                        const newCache = this.locationCacheRepository.create({
                            latitude: lat,
                            longitude: lon,
                            displayName,
                            sector: suburb,
                            district: district,
                            province: province,
                        });
                        await this.locationCacheRepository.save(newCache);
                        this.logger.log(`Cached result for ${lat}, ${lon}: ${displayName}`);
                    }
                    catch (e) {
                        this.logger.warn(`Cache collision for ${lat}, ${lon}`);
                    }
                    return displayName;
                }
                return `${lat}, ${lon}`;
            }
            catch (error) {
                this.logger.error(`Geocoding fetch failed: ${error.message}`);
                return `${lat}, ${lon}`;
            }
        });
    }
};
exports.GeocodingService = GeocodingService;
exports.GeocodingService = GeocodingService = GeocodingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_cache_entity_1.LocationCache)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GeocodingService);
//# sourceMappingURL=geocoding.service.js.map