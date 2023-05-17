export class StringUtilts {
  static kebabToNormal(kebabString: string): string {
    const words = kebabString.split('-');
    const firstWord = words[0];
    words[0] = firstWord.replace(firstWord[0], firstWord[0].toUpperCase());
    return words.join(' ');
  }

  static normalToKebab(str: string): string {
    return str.replace(/\s+/g, '-').toLowerCase();
  }

  static isKebabCase(str: string): boolean {
    return /^[a-z]+(-[a-z]+)*$/.test(str);
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
