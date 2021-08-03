import { DateManager } from '../../../src/infra/modules/DateManager';
import BarcodeManager from '../../../src/services/BarCodeManager';

const validBarcode = "03399201595100029953080202101020184050000127236";
const barcodeWithAInvalidFieldCheckDigit = "03399201595100029953081202101020184050000127236";
const barcodeWithTwoInvalidFieldCheckDigits = "03399201575100029953180202101020184050000127236";
const invalidGeneralCheckDigit = "03399201595100029953080202101020884050000127236"

const makeDateManeger = () => {
  class DateManager implements DateManager {
    public addDays(baseDate: Date, numOfDays: number): string {
      return '';
    }
  }

  return new DateManager();
};

const makeSut = (barcode: string) => {
  const dateManager = makeDateManeger();

  const sut = new BarcodeManager(barcode, dateManager);

  return sut;
}

describe('BarCodeManager', () => {
  it('Should return amount: R$ 1.272,36 when digits of the amount in barcode is 127236', () => {
    const sut = makeSut(validBarcode);
  });

  it('Should return amount: R$ 0,00 when digits of the amount in barcode is 0', () => {
    const sut = makeSut(validBarcode);
  });

  it('Should return expirationDate: 11/10/2020 when date factor in barcode is 8405', () => {
    const sut = makeSut(validBarcode);
  });

  it('Should return true when all field check codes is valid', () => {
    const sut = makeSut(validBarcode);
  });

  it('Should return false when a field check codes is invalid', () => {
    const sut = makeSut(barcodeWithAInvalidFieldCheckDigit);
  });

  it('Should return false when two field check codes are invalid', () => {
    const sut = makeSut(barcodeWithTwoInvalidFieldCheckDigits);
  });

  it('Should return true when general check code is valid', () => {
    const sut = makeSut(validBarcode);
  });

  it('Should return false when general check code is invalid', () => {
    const sut = makeSut(invalidGeneralCheckDigit);
  });
});