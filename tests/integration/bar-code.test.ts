import request from "supertest";
import api from '../../src/api';

// REFACTOR - Create data builder
const digitableLineValid = '03399201595100029953080202101020184050000127236';

const barcodeWithAInvalidFieldCheckDigit = "03399201595100029953081202101020184050000127236";
const barcodeWithTwoInvalidFieldCheckDigits = "03399201575100029953180202101020184050000127236";
const invalidGeneralCheckDigit = "03399201595100029953080202101020884050000127236"

const digitableLineWithSpace = '03399201595100 29953080202101020184050000127236';
const digitableLineWithLetter = '03399201595100a29953080202101020184050000127236';
const digitableLineWithDot = '03399201595100.29953080202101020184050000127236';

describe('Route /boleto', () => {
  it('Should return 412 when digitableLine is smaller than 47 digits', (done) => {
    const dl = `${digitableLineValid.slice(2)}`; 

    request(api)
      .get(`/boleto/${dl}`)
      .expect(412, {
        error: "digitableLine must be 47 digits"
      }, done);
  });
  it('Should return 412 when digitableLine is bigger than 47 digits', (done) => {
    const dl = `00${digitableLineValid}`; 

    request(api)
      .get(`/boleto/${dl}`)
      .expect(412, {
        error: "digitableLine must be 47 digits"
      }, done);
  });
  it('Should return 412 when digitableLine contains letters', (done) => {
    request(api)
      .get(`/boleto/${digitableLineWithLetter}`)
      .expect(412, {
        error: "only numbers as a digit are accepted"
      }, done);
  });
  it('Should return 412 when digitableLine contains dot', (done) => {
    request(api)
      .get(`/boleto/${digitableLineWithDot}`)
      .expect(412, {
        error: "only numbers as a digit are accepted"
      }, done);
  });
  it('Should return 412 when digitableLine contains space', (done) => {
    request(api)
      .get(`/boleto/${digitableLineWithSpace}`)
      .expect(412, {
        error: "only numbers as a digit are accepted"
      }, done);
  });

  it('Should return 400 when a field check code is invalid', (done) => {
    request(api)
      .get(`/boleto/${barcodeWithAInvalidFieldCheckDigit}`)
      .expect(400, {
        error: 'Invalid Field check digits'
      }, done);
  });
  it('Should return 400 when two field check code is invalid', (done) => {
    request(api)
      .get(`/boleto/${barcodeWithTwoInvalidFieldCheckDigits}`)
      .expect(400, {
        error: 'Invalid Field check digits'
      }, done);
  });

  it('Should return 400 when the general check code is invalid', (done) => {
    request(api)
      .get(`/boleto/${invalidGeneralCheckDigit}`)
      .expect(400, {
          error: 'Invalid general check digit'
        }, done);
  });

  it('Should return 200 with date, amount and barcode when a valid digitableLine is provided', (done) => {
    request(api)
      .get(`/boleto/${digitableLineValid}`)
      .expect(200, {
          barCode: "03391840500001272369201551000299538020210102",
          amount: "R$ 1.272,36",
          expirationDate: "11/10/2020"
      }, done);
  });
});