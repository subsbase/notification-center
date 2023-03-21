import {
  Body,
  Controller,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Subject } from '../../repositories/subject/schema'; 
import { SubjectService } from '../../services/subject/subject.service';
import { BaseController } from '../base-controller';
import { FastifyReply } from 'fastify';
import { IActionResult } from '../response-helpers/action-result.interface';

@Controller('subjects')
export class SubjectController extends BaseController {

  constructor(private readonly subjectsService: SubjectService) {
    super();
  }

  @Post()
  async create(@Body() subject: Subject, @Res() response: FastifyReply): Promise<IActionResult> {
    try {
      const result = await this.
      subjectsService.create(subject);
      
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
  async update(@Body() subject: Subject, @Res() response: FastifyReply) {
    try{
      const result = await this.subjectsService.update(subject)
      if(result.modifiedCount < 1){
        return this.notFound(response)
      }
      else{
        return this.ok(response)
      }
    }catch(error){
      return this.internalServerError(error)
    }
  }
}
