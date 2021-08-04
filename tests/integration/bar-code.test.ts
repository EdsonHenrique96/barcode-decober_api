describe('Route /boleto', () => {
  it('Should return 422 when digitableLine is smaller than 47 digits', () => {});
  it('Should return 422 when digitableLine is bigger than 47 digits', () => {});
  it('Should return 422 when digitableLine contains letters', () => {});
  it('Should return 422 when digitableLine contains dot', () => {});
  it('Should return 422 when digitableLine contains space', () => {});

  it('Should return 400 when a field check code is invalid', () => {});
  it('Should return 400 when two field check code is invalid', () => {});
  it('Should return 400 when third field check code is invalid', () => {});

  it('Should return 400 when the general check code is invalid', () => {});

  it('Should return 200 with date, amount and barcode when a valid digitableLine is provided', () => {

  });
});