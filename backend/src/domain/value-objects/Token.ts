import { v4 as uuidv4 } from 'uuid';

export class Token {
  private readonly value: string;

  constructor(value?: string) {
    if (value) {
      this.validateToken(value);
      this.value = value;
    } else {
      this.value = uuidv4();
    }
  }

  private validateToken(token: string): void {
    if (!token || token.trim().length === 0) {
      throw new Error('Token cannot be empty');
    }
    
    if (token.length < 10) {
      throw new Error('Token must be at least 10 characters long');
    }
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Token): boolean {
    return this.value === other.value;
  }

  static generate(): Token {
    return new Token();
  }

  static fromString(value: string): Token {
    return new Token(value);
  }
}