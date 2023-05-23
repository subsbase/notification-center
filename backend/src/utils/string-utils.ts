export class StringUtilts {
  static isValidUrlContent(str: string){
    return /^[a-zA-Z0-9\-._#[@!$'()*,;]*$/.test(str);
  }

  static isString(obj: any): boolean {
    return typeof obj === 'string' || obj instanceof String;
  }

  static containsSpaces(str: string): boolean {
    return /\s/g.test(str);
  }

  static isEmptyOrWhiteSpace(str: string): boolean {
    return str?.trim().length === 0;
  }
}
