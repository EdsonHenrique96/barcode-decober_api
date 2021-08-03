const getLastDigitFromDecimal = (currentValue: number): number => {
  return parseInt(currentValue.toString()[1], 10);
}

const getSumOfDigitsAux = (previousValue: number, currentValue: number, index: number): number => {
  let sum = currentValue;
  if((index % 2) === 0) sum = currentValue * 2;

  if (sum > 9) {
    const x = sum.toString().split('');
    sum = parseInt(x[0]) + parseInt(x[1]);
  }

  return previousValue + sum;
}

const getSumOfDigits = (digits: string[]): number => {
  return digits.map((x) => parseInt(x, 10)).reduce(getSumOfDigitsAux, 0);
}

const getNextDecimal = (num: number): number => {
  return (Math.ceil(num / 10) * 10)
}

export default {
  getLastDigitFromDecimal,
  getSumOfDigits,
  getNextDecimal
}