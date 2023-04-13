import { Controller, Get } from "@nestjs/common";
import { HealthManager } from "../../managers/health/health.manager";
import { IgnoreResponse } from "../decorators/ignore-response.decorator";
import { HealthCheckResult } from "@nestjs/terminus";

@Controller('healthz')
export class HealthController {
    
    constructor(private readonly healthManager: HealthManager) {}

    @Get()
    @IgnoreResponse()
    async checkHealth(): Promise<HealthCheckResult> {    
        return await this.healthManager.checkHealth();
    }
}