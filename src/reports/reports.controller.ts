import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

// Simple guard placeholder - open for mobile app posting, protected for admin GET
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    /**
     * POST /reports
     * Called by the mobile app when a user submits a leak report.
     */
    @Post()
    create(@Body() dto: CreateReportDto) {
        return this.reportsService.create(dto);
    }

    /**
     * GET /reports
     * Called by the admin dashboard to list all reports with device & owner info.
     */
    @Get()
    findAll() {
        return this.reportsService.findAll();
    }

    /**
     * GET /reports/:id
     * Get a single report with full device/user details.
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reportsService.findOne(id);
    }

    /**
     * PATCH /reports/:id/status
     * Called by the admin to block water or dismiss this report.
     */
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
        return this.reportsService.updateStatus(id, dto);
    }
}
