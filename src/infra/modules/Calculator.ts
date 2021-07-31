export class Calculator {
  public getLastDigitFromDecimal (currentValue: number): number {
    return parseInt(currentValue.toString()[1], 10);
  }
  
  private getSumOfDigitsAux(previousValue: number, currentValue: number, index: number): number{
    let sum = currentValue;
    if((index % 2) === 0) sum = currentValue * 2;
  
    if (sum > 9) {
      const x = sum.toString().split('');
      sum = parseInt(x[0]) + parseInt(x[1]);
    }
  
    return previousValue + sum;
  }
  
  public getSumOfDigits(digits: string[]): number {
    return digits.map((x) => parseInt(x, 10)).reverse().reduce(this.getSumOfDigitsAux, 0);
  }

  public getNextDecimal(num: number) {
    return (Math.ceil(num / 10) * 10)
  }

  public restOfDivision(dividend: number, divisor: number) {
    return dividend % divisor;
  }

  public subtract(...numbers: number[]) {
    return numbers.reduce((x, y) => x - y);
  }
}