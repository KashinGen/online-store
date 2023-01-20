import { checkValidName, checkValidPhone, checkValidAddress, checkValidEmail} from '../src/util'


describe('Name Validation', () => {
  it('should correct validate name', () => {
    const result = checkValidName('Egor Litavor');
    expect(result).toEqual(true);
  });
  it('should return false if short name', () => {
    const result = checkValidName('Egor');
    expect(result).toEqual(false);
  });
  it('should return false if incorrect length of name', () => {
    const result = checkValidName('Yi Ho');
    expect(result).toEqual(false);
  });
});

describe('Adress Validation', () => {
  it('should correct validate adress', () => {
    const result = checkValidAddress('Lenina Minsk Belarus');
    expect(result).toEqual(true);
  });
  it('should return false if short adress', () => {
    const result = checkValidAddress('Minsk Belarus');
    expect(result).toEqual(false);
  });
  it('should return false if incorrect length of adress part', () => {
    const result = checkValidAddress('Nizami Baku AZ');
    expect(result).toEqual(false);
  });
});

describe('Tel Validation', () => {
  it('should correct validate tel', () => {
    const result = checkValidPhone('+375331234567');
    expect(result).toEqual(true);
  });
  it('should return false if no +', () => {
    const result = checkValidPhone('80331234567');
    expect(result).toEqual(false);
  });
  it('should return false if incorrect length of tel', () => {
    const result = checkValidPhone('+37533');
    expect(result).toEqual(false);
  });
});

describe('EMail Validation', () => {
  it('should correct validate email', () => {
    const result = checkValidEmail('name@host.com');
    expect(result).toEqual(true);
  });
  it('should return false if no @', () => {
    const result = checkValidEmail('fakeemail.com');
    expect(result).toEqual(false);
  });
  it('should return false if incorrect length of any part', () => {
    const result = checkValidEmail('email@');
    expect(result).toEqual(false);
  });
});