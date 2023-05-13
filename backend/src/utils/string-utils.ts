export class StringUtilts {
  static kebabToNormal(kebabString: string): string {
    return kebabString
      .split('-')
      .map((word) => {
        const [first, ...rest] = word;
        return first.toUpperCase() + rest.join('');
      })
      .join(' ');
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
    return str.trim().length === 0;
  }
}
