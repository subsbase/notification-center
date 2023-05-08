import { Injectable } from "@nestjs/common";
import { Schema } from "mongoose";

@Injectable()
export class SchemaFactory {

    METHODS: Array<RegExp> = [
        new RegExp(/^count$/),
        new RegExp(/^countDocuments$/),
        new RegExp(/^deleteOne$/),
        new RegExp(/^deleteMany$/),
        new RegExp(/^estimatedDocumentCount$/),
        new RegExp(/^find$/),
        new RegExp(/^findOne$/),
        new RegExp(/^findOneAndDelete$/),
        new RegExp(/^findOneAndRemove$/),
        new RegExp(/^findOneAndReplace$/),
        new RegExp(/^findOneAndUpdate$/),
        new RegExp(/^remove$/),
        new RegExp(/^replaceOne$/),
        new RegExp(/^update$/),
        new RegExp(/^updateOne$/),
        new RegExp(/^updateMany$/),
    ];

    create<TSchema extends Schema>(schema: TSchema) : TSchema {
        const methods = this.METHODS;
    
        methods.forEach((method) => {
            schema.pre( method,
                { query: true, document: true } ,
                function(next){
                    const options = this.getOptions();
                    this.where({ realm: options.realm })
                    next()
                })
        })

        schema.pre('aggregate',
        { query: true, document: true },
        function(next){
            const options = this.options
            this.match({ realm: options.realm })
            next()
        })
        
        return schema;
    }
}