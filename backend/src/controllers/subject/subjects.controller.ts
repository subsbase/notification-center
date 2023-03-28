import {
  Body,
  Controller,
  Post,
  Put,
} from '@nestjs/common';
import { SubjectManager } from '../../managers/subject/subject.manager';
import { Subject } from '../../repositories/subject/schema'; 
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';

@Controller('subjects')
export class SubjectController extends BaseController {

  constructor(private readonly subjectManager: SubjectManager) {
    super();
  }

  @Post()
  async create(@Body() subject: Subject): Promise<IActionResult> {
    try {

      const result = await this.subjectManager.create(subject);
      
      if(!result.created) {
       return this.badRequest(result);
      }
      else{
        return this.created(result)
      }
    } catch(error) {
        return this.internalServerError(error)
    }
  }

  @Put()
  async update(@Body() subject: Subject): Promise<IActionResult> {
    try{
      const result = await this.subjectManager.update(subject)
      if(result.modifiedCount < 1){
        return this.notFound()
      }
      else{
        return this.ok()
      }
    }catch(error){
      return this.internalServerError(error)
    }
  }
}
