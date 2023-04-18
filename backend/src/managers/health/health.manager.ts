import { Injectable } from "@nestjs/common";
import { HealthCheckResult, HealthCheckService, MongooseHealthIndicator } from "@nestjs/terminus";

@Injectable()
export class HealthManager {
    constructor(
        private health: HealthCheckService,
        private mongooseHealth: MongooseHealthIndicator
    ) {}

    checkHealth(): Promise<HealthCheckResult> {
        return this.health.check([
            async () => this.mongooseHealth.pingCheck('subsbase-notification-center', {
                timeout: 1500
            })
        ])
    }
}