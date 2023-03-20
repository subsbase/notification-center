import {
  Body,
  Controller,
  Logger,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Subject } from 'src/repositories/subject/schema';
import { SubjectService } from 'src/services/subject/subject.service';
import { BaseController } from '../base-controller';
import { FastifyReply } from 'fastify';
import { MongoError } from 'mongodb';

@Controller('subjects')
export class SubjectController extends BaseController {

  constructor(private readonly subjectsService: SubjectService) {
    super();
  }

  @Post()
  async create(@Body() subject: Subject, @Res() response: FastifyReply) {
    try {
      const result = await this.
      subjectsService.create(subject);
      
      if(!result.created) {
        this.badRequest(response, result);
      }
      else{
        this.created(response, result)
      }
    } catch(error) {
      this.handleSubjectError(error, response, subject)
    }
  }

  @Put()
  async update(@Body() subject: Subject, @Res() response: FastifyReply) {
    try{
      const result = await this.subjectsService.update(subject)
      if(result.modifiedCount < 1){
          this.notFound(response)
      }
      else{
          this.ok(response)
      }
    }catch(error){
      this.handleSubjectError(error, response, subject)
    }
  }

  //#region Helpers
  private handleSubjectError(error: any, response: FastifyReply, subject: Subject): void{
    Logger.error(error);

    if(error instanceof MongoError && error.code === 11000){
      this.badRequest(response, { message: `Subject With name '${subject.name}' already exists`})
    }else{
      this.internalServerError(response);
    }
  }
  //#endregion
}
