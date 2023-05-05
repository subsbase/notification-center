import { Injectable } from "@nestjs/common";
import { Schema } from "mongoose";
import { GlobalContext } from "../types/global-context";

@Injectable()
export class SchemaFactory {

    METHODS: Array<RegExp> = [
        new RegExp(/^aggregate$/),
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
        new RegExp(/^insertMany$/)
    ];
    create<TSchema extends Schema>(schema: TSchema) : TSchema {
        const methods = this.METHODS;
    
        methods.forEach((method) => {
            schema.pre( method,
                { query: true, document: true,  } ,
                function(next){
                    this.where({ realm: GlobalContext.Realm })
                    next()
                })
        })

        schema.pre(['init', 'save', 'validate'],function(){
            if(!this.realm){
                this.set('realm', GlobalContext.Realm )
            }
        })
        
        return schema;
    }
}