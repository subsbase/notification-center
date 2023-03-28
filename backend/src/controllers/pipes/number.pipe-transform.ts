import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NumberPipeTransform implements PipeTransform<string,number> {
    transform(value: string, metadata: ArgumentMetadata): number {
        return Number.parseInt(value);
    }
}