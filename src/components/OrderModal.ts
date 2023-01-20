import { Component } from '../core/component';
import { ConfigComponent } from '../types';
import { checkValidAddress, checkValidCardNumber, checkValidEmail, checkValidName, checkValidPhone, getCardCompany, checkValidCardData, checkValidCVV } from '../util';

class OrderModal extends Component {
    _isEventsInited: boolean = false;
    onSubmitHandler: Function;
    constructor(onSubmitHandler: Function, config: ConfigComponent) {
        super(config);
        this.onSubmitHandler = onSubmitHandler;
    }

    render() {
            const blockCreditCard: string = `
            <div>
                <div>
                    <span class='type-card'></span>
                        <input  placeholder="Card number" type="text" maxlength='16' class="cardnumber">
                        <span class='error error-card'>
                    </span>
                </div>
                <div class='wrapper-valid'>
                    <input placeholder='00/00' class='valid' type='text' maxlength='5'>
                    <span class='error error-valid'></span>
                </div>
                <div>
                    <input placeholder="Code" type='text' maxlength='3' class="cvv">
                    <span class='error error-code'></span>
                </div>
            </div>`;
            this.template = `
                <div class='overflow'>
                    <div class='main-buy-now'>
                    <h2>Personal details</h2>
                    <div>
                        <input placeholder="Name" type="text" class="name" >
                        <span class='error error-name'></span>
                    </div>
                    <div>
                        <input placeholder="PhoneNumber" type="text"  class="phone">
                        <span class='error error-phone'></span>
                    </div>
                    <div>
                        <input placeholder="Adress" type="text" class="adress">
                        <span class='error error-adress'></span>
                    </div>
                    <div>
                        <input placeholder="E-mail" " type="email" min='000' max='999' class="mail">
                        <span class='error error-mail'></span>
                    </div>
                    <h2>Credit card details</h2>
                    <div class='credit-catd'>
                        ${blockCreditCard}
                    </div>
                    <button type="submit" class='bth-submit'>Submit</button>
                <div>
            </div>`;
        super.render();
        this.initEvents();
        this._isEventsInited = true;
    }
    initEvents() {
        const name: HTMLInputElement | null = document.querySelector('.name');
        const phone: HTMLInputElement | null = document.querySelector('.phone');
        const adress: HTMLInputElement | null = document.querySelector('.adress');
        const email: HTMLInputElement | null = document.querySelector('.mail');
        const cardnumber: HTMLInputElement | null = document.querySelector('.cardnumber');
        const cardData: HTMLInputElement | null = document.querySelector('.valid');
        const typeCard: HTMLSpanElement | null = document.querySelector('.type-card');
        const cvv: HTMLInputElement | null = document.querySelector('.cvv');
        if (name instanceof HTMLInputElement) {
            name.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const errorName = document.querySelector('.error-name');
                    if (!errorName) return;
                    const valid = checkValidName(e.target.value);
                    errorName.innerHTML = !valid ? 'ERROR' : '';                    
                }
            });
        }
        if (phone) {
            phone.addEventListener('input', (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value;
                    const errorPhone = document.querySelector('.error-phone');
                    const valid = checkValidPhone(value);
                    if (!errorPhone) return;
                    errorPhone.innerHTML = !valid ? 'ERROR' : '';
                }
            });
        }
        if (adress instanceof HTMLInputElement) {
            adress.addEventListener('input', (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value;
                    const errorAddress = document.querySelector('.error-adress');
                    if (!errorAddress) return;
                    const valid = checkValidAddress(value);
                    errorAddress.innerHTML = !valid ? 'ERROR' : '';
                }
            });
        }
        if (email instanceof HTMLInputElement) {
            email.addEventListener('input', (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value;
                    const errorEmail = document.querySelector('.error-mail');
                    if (!errorEmail) return;
                    const valid = checkValidEmail(value);
                    errorEmail.innerHTML = !valid ? 'ERROR' : '';
                }
            });
        }
        if (cardnumber instanceof HTMLInputElement) {
            cardnumber.addEventListener('input', (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value;
                    const errorCard = document.querySelector('.error-card');
                    if (!errorCard) return;
                    if (typeCard) {
                        typeCard.innerHTML = getCardCompany(value);
                    }
                    const valid = checkValidCardNumber(value);
                    errorCard.innerHTML = !valid ? 'ERROR' : '';
                }
            });
        }
        if (cardData instanceof HTMLInputElement) {
            cardData.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const str = e.target.value;
                    const errorCardData = document.querySelector('.error-valid');
                    if (!errorCardData) return;   
                    const value = str.length > 2 ? str.slice(0, 2) + str.slice(3) : str;
                    if (isNaN(+value)) {
                        cardData.value = str.slice(0, str.length - 1);
                    }
                    if (str.length === 2) {
                        cardData.value += '/';
                    }
                    if (!errorCardData) return;
                    const valid = checkValidCardData(str);                        
                    errorCardData.innerHTML = !valid ? 'ERROR' : '';
                }
            });
        }
        if (cvv instanceof HTMLInputElement) {
            cvv.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const str = e.target.value;
                    const errorCode = document.querySelector('.error-code');
                    if (!errorCode) return;
                    if (str) {
                        if (isNaN!(+e.target.value.slice(1))) {
                            e.target.value = str
                                .split('')
                                .slice(0, str.length - 1)
                                .join('');
                        }
                    }
                    const valid = checkValidCVV(str);
                    errorCode.innerHTML = !valid ? 'ERROR' : '';
                }
            });
        }
        const error: HTMLSpanElement | NodeList | null = document.querySelectorAll('.error');
        const bthSubmit: HTMLButtonElement | null = document.querySelector('.bth-submit');
        if (bthSubmit && error) {
            bthSubmit.addEventListener('click', () => {
                const arrayResult: String[] = [];
                const event = new Event('input', {bubbles:true});
                if (name instanceof HTMLInputElement) {
                    name.dispatchEvent(event);
                }
                if (phone instanceof HTMLInputElement) {
                    phone.dispatchEvent(event);
                }
                if (adress instanceof HTMLInputElement) {
                    adress.dispatchEvent(event);
                }
                if (email instanceof HTMLInputElement) {
                    email.dispatchEvent(event);
                }
                if (cardnumber instanceof HTMLInputElement) {
                    cardnumber.dispatchEvent(event);
                }
                if (cardData instanceof HTMLInputElement) {
                    cardData.dispatchEvent(event);
                }
                if (cvv instanceof HTMLInputElement) {
                    cvv.dispatchEvent(event);
                }
                const errorArray: String[] = [];
                error.forEach((el) => {
                    if (el.textContent !== null) {
                        errorArray.push(el.textContent);
                    }
                });

                let isError = errorArray.every((el) => {
                    return el.toString() !== 'ERROR';
                });
                if (
                    arrayResult.every((el) => {
                        return el.length > 2;
                    }) &&
                    isError
                ) {
                    this.onSubmitHandler();
                } else {
                    for (let i = 0; i <= arrayResult.length; i++) {
                        if (arrayResult[i].length < 2) {
                            error[i].textContent = 'ERROR';
                        }
                    }
                }
            });
        }
        const overflow: HTMLDivElement | null = document.querySelector('.overflow');
        if (overflow) {
            overflow.addEventListener('click', (e) => {
                const target = e.target;
                if (target) {
                    if (target == overflow) {
                        this.hide();
                    }
                }
            });
        }
    }
    hide() {
        const overflow: HTMLDivElement | null = document.querySelector('.overflow');
        overflow && overflow.remove();

    }
}
export default OrderModal;
