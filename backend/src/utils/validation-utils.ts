import { InvalidArgumentError } from '../types/exceptions';
import { StringUtilts } from './string-utils';

export class ValidationUtils {
  static validateStringId(id: string, propertyName: string) {
    if (!StringUtilts.isString(id) || StringUtilts.isEmptyOrWhiteSpace(id) || !StringUtilts.isKebabCase(id)) {
      throw new InvalidArgumentError(propertyName, `invalid ${propertyName} ${id} must be provided in kebab-case`);
    }
  }

  static validateString(str: string, argName: string) {
    if (!StringUtilts.isString(str) || StringUtilts.isEmptyOrWhiteSpace(str)) {
      throw new InvalidArgumentError(argName);
    }
  }

  static validateUrl(url: string, propertyName: string){
    if(!/^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url)){
      throw new InvalidArgumentError(propertyName, `${propertyName} is not a valid url`)
    }
  }

  static validateNaturalNumber(num: number, argName: string) {
    if (typeof num !== 'number' || isNaN(num) || num < 0) {
      throw new InvalidArgumentError(argName);
    }
  }
}
