import { Injectable } from "@nestjs/common";
import { Subject } from "../../repositories/subject/schema";
import { CreatedModel, UpdatedModel } from "../../repositories/helper-types";
import { SubjectService } from "../../services/subject/subject.service";

@Injectable()
export class SubjectManager {
    constructor(private readonly subjectService: SubjectService) {}
    
    async getAll(pageNum: number, pageSize: number): Promise<Array<Subject>> {
        return this.subjectService.getAll(pageNum, pageSize);
    }

    async create(subject: Subject) : Promise<CreatedModel> {
        return await this.subjectService.create(subject);
    }

    async update(subject: Subject): Promise<UpdatedModel> {
        return await this.subjectService.update(subject)
    }
}