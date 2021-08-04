import { 
  InvalidFieldCheckDigit,
  InvalidGeneralCheckDigit
} from './errors';
import { DateManager } from '../infra/modules/DateManager';

import Calculator from '../infra/modules/Calculator';
const {
  getLastDigitFromDecimal,
  getNextDecimal,
  getSumOfDigits
} = Calculator;

export default class BarCodeManager {
  public readonly BASE_DATE = new Date("10/07/1997");

  private digitableLine: string[];

  private firstCheckDigit: number;
  private secondCheckDigit: number;
  private thirdCheckDigit: number;

  private generalCheckDigit: number;

  private expirationDateFactor: number;

  private readonly date: DateManager;

  
  constructor(digitableLine: string, date: DateManager) {
    this.date = date;
    this.digitableLine = digitableLine.split('');

    this.firstCheckDigit = parseInt(digitableLine[9]);
    this.secondCheckDigit = parseInt(digitableLine[20]);
    this.thirdCheckDigit = parseInt(digitableLine[31]);

    this.generalCheckDigit = parseInt(digitableLine[32]);

    this.expirationDateFactor = parseInt(digitableLine.slice(33, 37));
  }

  private calculateFieldCheckDigit(digitableLine: string[]): number[] {
    const firstField = digitableLine.slice(0, 9).reverse();
    const secondField = digitableLine.slice(10, 20).reverse();
    const thirdField = digitableLine.slice(21,31).reverse();

    const checkDigits = [
      firstField,
      secondField,
      thirdField
    ].map(field => {
      const sumOfDigits = getSumOfDigits(field);
        
      const nextDecimal = getNextDecimal(sumOfDigits);
        
      const restOfDivision = sumOfDigits % 10;

      const checkDigit = nextDecimal - restOfDivision;

      return getLastDigitFromDecimal(checkDigit);
    });

    return checkDigits;
  }

  private calculateGeneralCheckDigit(barCode: string[]) {
    const checkCodeSpecialCases = [0, 10, 11];
    const validDigitsFromBarCode = barCode
      .filter((_value, index) => index !== 4)
      .map(x => parseInt(x, 10))
      .reverse();
    
    // FIXME - refactor, should to be recursive function. 
    let sum = 0;

    for (let i = 0, factor = 2; i < validDigitsFromBarCode.length; i++) {
      if(factor > 9) factor = 2;

      sum += (validDigitsFromBarCode[i] * factor);
      factor++;
    }

    let generalCheckDigit = 11 - (sum % 11);

    const isSpecialCase = checkCodeSpecialCases.indexOf(generalCheckDigit) !== -1;
    if (isSpecialCase) {
      generalCheckDigit = 1;
    }
    
    return generalCheckDigit;
  }

  public getBarCode() {
    // FIXME - Refactor
    const bank = this.digitableLine.slice(0,3).join('');
    const currency = this.digitableLine[3];
    const firstPositionFreeField = this.digitableLine.slice(4, 9).join('');
    const secondPositionFreeField = this.digitableLine.slice(10, 20).join('');
    const thidPositionFreeFiel = this.digitableLine.slice(21, 31).join('');
    const generalCheckCode = this.digitableLine[32];
    const expirationDateFactor = this.digitableLine.slice(33,37).join('');
    const amount = this.digitableLine.slice(37).join('');

    return `${bank}${currency}${generalCheckCode}${expirationDateFactor}${amount}${firstPositionFreeField}${secondPositionFreeField}${thidPositionFreeFiel}`
  }

  /**
   * 
   * DT - Boletos com valores superiores a R$ 99.999.999,99 devem avançar sobre o "Fator de Vencimento",
   * eliminando-o do código de barras.
   */
  public getExpirationDate(): string {
    if(this.expirationDateFactor <= 0) {
      return '';
    }
    
    const expDate = this.date.addDays(this.BASE_DATE, this.expirationDateFactor);

    if(!Number.isInteger(this.expirationDateFactor)) {
      throw new Error('expirationDateFactor must be integer');
    }
    
    return expDate;
  }

  public getAmount(): string {
    let amount = Number(
      `${this.digitableLine.slice(37, 45).join('')}.${this.digitableLine.slice(45).join('')}`
    );
    
    return amount
      .toLocaleString(
        'pt-br',
        {
          style: 'currency',
          currency: 'BRL',
        }
      );
  }

  private isValidFieldCheckCodes(checkDigits: number[]): boolean {
    return JSON.stringify(checkDigits) 
      === JSON.stringify(
        [
          this.firstCheckDigit,
          this.secondCheckDigit,
          this.thirdCheckDigit
        ]
      );
  }

  private isValidGeneralCheckDigit(generalCheckDigit: number): boolean {
    return generalCheckDigit === this.generalCheckDigit;
  }

  public isValid(): boolean {
    const checkCodes = this.calculateFieldCheckDigit(this.digitableLine);
    const fieldCheckDigitsIsValid = this.isValidFieldCheckCodes(checkCodes);

    if (!fieldCheckDigitsIsValid) {
      throw new InvalidFieldCheckDigit('Invalid Field check digits');
    }

    const barCode = this.getBarCode();
    const generalCheckDigit = this.calculateGeneralCheckDigit(barCode.split(''));
    const generalCheckDigitIsValid = this.isValidGeneralCheckDigit(generalCheckDigit);

    if (!generalCheckDigitIsValid) {
      throw new InvalidGeneralCheckDigit('Invalid general check digit');
    }

    return true;
  }
}