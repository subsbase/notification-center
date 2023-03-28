import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NumberPipeTransform implements PipeTransform<string,number> {

    constructor(private readonly defaultValue: number) {}

    transform(value: string, metadata: ArgumentMetadata): number {
        if(!value)
            return this.defaultValue;
        return Number.parseInt(value);
    }
}