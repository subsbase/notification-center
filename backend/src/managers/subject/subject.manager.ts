import { Injectable } from '@nestjs/common';
import { Subject } from '../../repositories/subject/schema';
import { CreatedModel, UpdatedModel } from '../../repositories/helper-types';
import { SubjectService } from '../../services/subject/subject.service';

@Injectable()
export class SubjectManager {
  constructor(private readonly subjectService: SubjectService) {}

  async getAll(realm: string, pageNum: number, pageSize: number): Promise<Array<Subject>> {
    return this.subjectService.getAll(realm, pageNum, pageSize);
  }

  async create(realm: string, subject: Subject): Promise<CreatedModel> {
    return await this.subjectService.create(realm, subject);
  }

  async update(realm: string, subject: Subject): Promise<UpdatedModel> {
    return await this.subjectService.update(realm, subject);
  }
}
