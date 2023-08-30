import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseAndValidateDatePipe implements PipeTransform {
  constructor(private readonly dateProperties: Array<string>) {}

  transform(value: any) {
    for (const property of this.dateProperties) {
      value[property] = new Date(value[property]);
    }
    return value;
  }
}
