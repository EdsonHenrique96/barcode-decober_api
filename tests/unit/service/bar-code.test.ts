import { DateManager } from '../../../src/infra/modules/DateManager';
import BarcodeManager from '../../../src/services/BarCodeManager';

const validBarcode = "03399201595100029953080202101020184050000127236";

const barCodeWith0Amount = "03399201595100029953080202101020184050000000000";
const barCodeWithDateFactor0 = "03399201595100029953080202101020100000000127236";

const barcodeWithAInvalidFieldCheckDigit = "03399201595100029953081202101020184050000127236";
const barcodeWithTwoInvalidFieldCheckDigits = "03399201575100029953180202101020184050000127236";
const invalidGeneralCheckDigit = "03399201595100029953080202101020884050000127236"

const makeDateManeger = () => {
  class DateManagerMock implements DateManager {
    public addDays(baseDate: Date, numOfDays: number): string {
      return '';
    }
  }

  return new DateManagerMock();
};

const makeSut = (barcode: string) => {
  const dateManager = makeDateManeger();

  const sut = new BarcodeManager(barcode, dateManager);

  return { sut, dateManager };
}

describe('BarCodeManager', () => {
  it('Should return amount: R$ 1.272,36 when digits of the amount in barcode is 127236', () => {
    const expectedAmount = 1272.36.toLocaleString(
      'pt-br',
      {
        style: 'currency',
        currency: 'BRL',
      }
    );

    const { sut } = makeSut(validBarcode);

    const amount = sut.getAmount();
    expect(amount).toEqual(expectedAmount);
  });

  it('Should return amount: R$ 0,00 when digits of the amount in barcode is 0', () => {
    const expectedAmount = 0..toLocaleString(
      'pt-br',
      {
        style: 'currency',
        currency: 'BRL',
      }
    );

    const { sut } = makeSut(barCodeWith0Amount);
    const amount = sut.getAmount();
    expect(amount).toEqual(expectedAmount);
  });

  it('Should return expirationDate: 11/10/2020 when date factor in barcode is 8405', () => {
    const expectedDate = '11/10/2020';
    const { sut, dateManager } = makeSut(validBarcode);

    const dateManagerSpy =jest.spyOn(dateManager, 'addDays')
      .mockReturnValueOnce('11/10/2020');

    const expirationDate = sut.getExpirationDate();
    expect(dateManagerSpy).toHaveBeenCalledWith(sut.BASE_DATE, 8405);
    expect(expirationDate).toEqual(expectedDate);
  });

  // NOT IMPLEMENTED
  it.todo('Should return empty expirationDate when amount is bigger than R$ 99.999.999,99')

  it('Should return expirationDate: empty string when date factor in barcode is 0', () => {
    const expectedDate = '';
    const { sut } = makeSut(barCodeWithDateFactor0);

    const expirationDate = sut.getExpirationDate();
    expect(expirationDate).toEqual(expectedDate);
  });

  it('Should return true when all field check codes is valid', () => {
    const { sut } = makeSut(validBarcode);

    const isValid = sut.isValid();
    expect(isValid).toBe(true);
  });

  it('Should throw error when a field check codes is invalid', () => {
    const { sut } = makeSut(barcodeWithAInvalidFieldCheckDigit);

    try {
      sut.isValid()
    } catch (error) {
      expect(error.message).toEqual('Invalid Field check digits');
    }
  });

  it('Should throw error when two field check codes are invalid', () => {
    const { sut } = makeSut(barcodeWithTwoInvalidFieldCheckDigits);

    try {
      sut.isValid()
    } catch (error) {
      expect(error.message).toEqual('Invalid Field check digits');
    }
  });

  it('Should return true when general check code is valid', () => {
    const { sut } = makeSut(validBarcode);

    const isValidGeneralCheckDigit = sut.isValid();
    expect(isValidGeneralCheckDigit).toBe(true);
  });

  it('Should throw error when general check code is invalid', () => {
    const { sut } = makeSut(invalidGeneralCheckDigit);

    try {
      sut.isValid()
    } catch (error) {
      expect(error.message).toEqual('Invalid general check digit');
    }
  });
});