import { checkValidCVV, checkValidCardNumber, checkValidCardData} from '../src/util'



describe('Card Validation', () => {
  it('should correct validate card', () => {
    const result = checkValidCardNumber('4444444444444444');
    expect(result).toEqual(true);
  });
  it('should return false if short card length', () => {
    const result = checkValidCardNumber('42552533235525');
    expect(result).toEqual(false);
  });
  it('general check', () => {
    const cartData = [
      { cart: '4444444444444444', result: true },
      { cart: '44444444 4444444', result: false },
      { cart: '', result: false },
      { cart: '4 4 4 4', result: false },
    ];

    cartData.forEach(({ cart, result }) => {
      const res = checkValidCardNumber(cart);
      expect(res).toEqual(result);
    });
  });
});

describe('Date Validation', () => {
  it('should correct validate date', () => {
    const result = checkValidCardData('12/24');
    expect(result).toEqual(true);
  });
  it('should return false if old', () => {
    const result = checkValidCardData('12/21');
    expect(result).toEqual(false);
  });
  it('should return false if incorrect month', () => {
    const result = checkValidCardData('24/24');
    expect(result).toEqual(false);
  });
  it('general check', () => {
    const dateData = [
      { date: '11/23', result: true },
      { date: '110/23', result: false },
      { date: '110/2', result: false },
      { date: '/', result: false },
      { date: '10/0', result: false },
      { date: '0/23', result: false },
    ];

    dateData.forEach(({ date, result }) => {
      const res = checkValidCardData(date);
      expect(res).toEqual(result);
    });
  });
});

describe('CVC Validation', () => {
  it('should correct validate CVC', () => {
    const result = checkValidCVV('111');
    expect(result).toEqual(true);
  });
  it('should return false if short', () => {
    const result = checkValidCVV('87');
    expect(result).toEqual(false);
  });
  it('should return false if big', () => {
    const result = checkValidCVV('123456789');
    expect(result).toEqual(false);
  });
});