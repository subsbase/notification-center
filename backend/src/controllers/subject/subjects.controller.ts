import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SubjectManager } from '../../managers/subject/subject.manager';
import { Subject } from '../../repositories/subject/schema'; 
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NumberPipeTransform } from '../pipes/number.pipe-transform';
import { Authorize } from '../decorators/authorize.decorator';

@Controller('subjects')
export class SubjectsController extends BaseController {

  constructor(
    private readonly subjectManager: SubjectManager) {
    super();
  }
  
  @Authorize()
  @Get()
  async listSubjects(
  @Query('pageNum', new NumberPipeTransform(1)) 
  pageNum: number,
  @Query('pageSize', new NumberPipeTransform(50))
  pageSize: number
  ) : Promise<IActionResult> {

    const subjects = await this.subjectManager.getAll(pageNum, pageSize)
    
    return this.ok(subjects?? new Array())
  }

  @Authorize()
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

  @Authorize()
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
