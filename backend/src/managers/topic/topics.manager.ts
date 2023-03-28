import { Injectable } from "@nestjs/common";
import { CreatedModel } from "../../repositories/helper-types";
import { Topic } from "../../repositories/topic/schema";
import { TopicService } from "../../services/topic/topic.service";

@Injectable()
export class TopicsManager {
    constructor(private readonly topicsService: TopicService) {}
    async create(topic: Topic) : Promise<CreatedModel> {
        return await this.topicsService.create(topic);
    }
}