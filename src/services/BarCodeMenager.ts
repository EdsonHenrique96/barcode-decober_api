import { Calculator } from '../infra/modules/Calculator';

import { DateManager } from '../infra/modules/DateManager';

export default class BarCodeManager {
  private readonly BASE_DATE = new Date("10/07/1997");

  private barCode: string[];

  private firstCheckDigit: number;
  private secondCheckDigit: number;
  private thirdCheckDigit: number;

  private generalCheckDigit: number;

  private expirationDateFactor: number;

  private readonly calculator: Calculator;
  private readonly date: DateManager;

  
  constructor(barCode: string, calculator: Calculator, date: DateManager) {
    this.calculator = calculator;
    this.date = date;
    this.barCode = barCode.split('');

    this.firstCheckDigit = parseInt(barCode[9]);
    this.secondCheckDigit = parseInt(barCode[20]);
    this.thirdCheckDigit = parseInt(barCode[31]);

    this.generalCheckDigit = parseInt(barCode[32]);

    this.expirationDateFactor = parseInt(barCode.slice(33, 37));
  }

  /**
   * 
   * DT - Boletos com valores superiores a R$ 99.999.999,99 devem avançar sobre o "FAtor de Vencimento",
   * eliminando-o do código de barras.
   */
  public getExpirationDate(): string {
    const expDate = this.date.addDays(this.BASE_DATE, this.expirationDateFactor);

    if(!Number.isInteger(this.expirationDateFactor)) {
      throw new Error('expirationDateFactor must be integer');
    }

    if(this.expirationDateFactor <= 0) {
      return '';
    }

    return expDate;
  }

  private calculateFieldCheckCodes(barCode: string[]): number[] {
    const firstField = barCode.slice(0, 9);
    const secondField = barCode.slice(10, 20);
    const thirdField = barCode.slice(21,31);

    const sumOfDigitsFromFirstField =  this.calculator.getSumOfDigits(firstField);
    const sumOfDigitsFromSecondField =  this.calculator.getSumOfDigits(secondField);
    const sumOfDigitsFromThirdField =  this.calculator.getSumOfDigits(thirdField);

    const nextDecimalFromFirstField = this.calculator.getNextDecimal(sumOfDigitsFromFirstField);
    const nextDecimalFromSecondField = this.calculator.getNextDecimal(sumOfDigitsFromSecondField);
    const nextDecimalFromThirdField = this.calculator.getNextDecimal(sumOfDigitsFromThirdField);

    const restOfDivisionFromFirstField = this.calculator.restOfDivision(sumOfDigitsFromFirstField, 10);
    const restOfDivisionFromSecondField = this.calculator.restOfDivision(sumOfDigitsFromSecondField, 10);
    const restOfDivisionFromThirdField = this.calculator.restOfDivision(sumOfDigitsFromThirdField, 10);

    const firstCheckDigit = this.calculator.subtract(nextDecimalFromFirstField, restOfDivisionFromFirstField);
    const secondCheckDigit = this.calculator.subtract(nextDecimalFromSecondField, restOfDivisionFromSecondField);
    const thirdCheckDigit = this.calculator.subtract(nextDecimalFromThirdField, restOfDivisionFromThirdField);
  
    return [firstCheckDigit, secondCheckDigit, thirdCheckDigit].map(this.calculator.getLastDigitFromDecimal);
  }

  private isValidFieldCheckCodes(checkCodes: number[]): boolean {
    return JSON.stringify(checkCodes) 
      === JSON.stringify(
        [
          this.firstCheckDigit,
          this.secondCheckDigit,
          this.thirdCheckDigit
        ]
      );
  }

  public validateBarCode(): boolean {
    const checkCodes = this.calculateFieldCheckCodes(this.barCode);
    console.log(checkCodes);
    const isValid = this.isValidFieldCheckCodes(checkCodes);

    return isValid;
  }
}