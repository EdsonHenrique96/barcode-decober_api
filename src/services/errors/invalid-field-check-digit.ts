export class InvalidFieldCheckDigit extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidFieldCheckDigit'
  }
}