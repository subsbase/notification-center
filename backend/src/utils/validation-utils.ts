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

  static validateNaturalNumber(num: number, argName: string) {
    if (typeof num !== 'number' || isNaN(num) || num < 0) {
      throw new InvalidArgumentError(argName);
    }
  }
}
