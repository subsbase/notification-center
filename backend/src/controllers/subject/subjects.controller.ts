import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SubjectManager } from '../../managers/subject/subject.manager';
import { Subject } from '../../repositories/subject/schema'; 
import { BaseController } from '../base-controller';
import { IActionResult } from '../response-helpers/action-result.interface';
import { NumberPipeTransform } from '../pipes/number.pipe-transform';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from '../../types/global-types';

@Controller('subjects')
export class SubjectsController extends BaseController {

  constructor(
    @Inject(REQUEST) protected readonly request: FastifyRequest,
    private readonly subjectManager: SubjectManager) {
    super(request);
  }
  
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
