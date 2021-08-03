export class InvalidGeneralCheckDigit extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGeneralCheckDigit'
  }
}