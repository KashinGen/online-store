import CartItemComponent from '../components/CartItem';
import { cartModel } from '../models/cartModel';
import router from '../router';
import { CartAction, CartItem, Controller, Promo } from '../types';
import { getCart, setURLParams, updateCartInfo } from '../util';
import { CartView } from '../view/cartView';
import CartModel from '../models/Cart';

export class CartController extends Controller {
    _view: CartView | null = null;
    _model: cartModel;
    cartToShow: CartItem[] = [];
    constructor() {
        super();
        this._model = new cartModel();
    }

    init() {
        this.getCartToShow();
        this.getURLParams();
        const root = document.querySelector('.cart__inner');
        if (root instanceof HTMLElement) {
            this._view = new CartView(this, root);
        }
        this.render();
        const isButOneClick = localStorage.getItem('buy-one-click');
        if (isButOneClick) {
            this.openModal();
            localStorage.removeItem('buy-one-click');
        }
    }
    getURLParams(): void {
        const searchParams = new URLSearchParams(window.location.search);
        const limit = searchParams.get('limit');
        const page = searchParams.get('page');
        const cart = CartModel.getCart();
        const allPages = this._model.getAllPages();
        if (limit) {
            const selectedLimit = +limit <= cart.length && +limit >= 1 ? +limit : cart.length;
            this._model.setLimit(selectedLimit);
        }
        if (page) {
            let selectedPage = +page;
            if (selectedPage < 1) {
                selectedPage = 1;
            }
            if (selectedPage > allPages) {
                selectedPage = allPages;
            }
            this._model.setCurrentPage(selectedPage);
        }
        this.getCartToShow();
    }

    getCartToShow() {
        const cart = CartModel.getCart();
        const currentPage = this._model.getCurrentPage();
        const limit = this._model.getLimit();
        this.cartToShow = cart.slice((currentPage - 1) * limit, currentPage * limit);
        const allPages = Math.ceil(cart.length / limit);
        this._model.setAllPages(allPages);
    }

    openModal() {
        const blockCreditCard: string = `
        <div>
        <div><span class='type-card'></span><input  placeholder="Card number" type="text" maxlength='16' class="cardnumber"><span class='error error-card'></span></div>
        <div class='wrapper-valid'><input placeholder='00/00' class='valid' type='text' maxlength='5'><span class='error error-valid'></span></div>
        <div><input placeholder="Code" type='text' maxlength='3' class="cvv"><span class='error error-code'></span></div>
        </div>`;
        const BlockBuyNow: string = `<div class='overflow'>
            <div class='main-buy-now'>
            <h2>Personal details</h2>
            <div><input placeholder="Name" type="text" class="name" ><span class='error error-name'></span></div>
            <div><input placeholder="PhoneNumber" type="text"  class="phone"><span class='error error-phone'></span></div>
            <div><input placeholder="Adress" type="text" class="adress"><span class='error error-adress'></span></div>
            <div><input placeholder="E-mail" " type="email" min='000' max='999' class="mail"><span class='error error-mail'></span></div>
            <h2>Credit card details</h2>
            <div class='credit-catd'>
            ${blockCreditCard}
            </div>
            <button type="submit" class='bth-submit'>Submit</button>
            <div>
        </div>`;
        let container = document.querySelector('.container');
        if (container !== null) {
            container.insertAdjacentHTML('afterbegin', BlockBuyNow);
        }
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
                    const str = e.target.value.split(' ');
                    const errorName = document.querySelector('.error-name');
                    if (!errorName) return;
                    if (str) {
                        if (str[0].length < 3 || str[1].length < 3) {
                            errorName.innerHTML = 'ERROR';
                        } else {
                            errorName.innerHTML = '';
                        }
                    }
                }
            });
        }
        if (phone) {
            phone.addEventListener('input', (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value;
                    const phoneAllowed = '+0123456789';
                    const errorPhone = document.querySelector('.error-phone');
                    let error = !value.split('').every((char) => phoneAllowed.includes(char));
                    if (value[0] !== '+' || value.length < 10) {
                        error = true;
                    }
                    if (!errorPhone) return;
                    if (!error) {
                        errorPhone.innerHTML = '';
                    } else {
                        errorPhone.innerHTML = 'ERROR';
                    }
                }
            });
        }
        if (adress instanceof HTMLInputElement) {
            adress.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const str = e.target.value.trim().split(' ');
                    const errorAddress = document.querySelector('.error-adress');
                    if (!errorAddress) return;
                    if (str) {
                        const isTrue = str.every((el) => el.length > 2);
                        if (!isTrue || str.length < 3) {
                            errorAddress.innerHTML = 'ERROR';
                        } else {
                            errorAddress.innerHTML = '';
                        }
                    }
                }
            });
        }
        if (email instanceof HTMLInputElement) {
            email.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const str = e.target.value;
                    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
                    const errorEmail = document.querySelector('.error-mail');
                    if (!errorEmail) return;
                    if (str) {
                        if (EMAIL_REGEXP.test(str.toString())) {
                            errorEmail.innerHTML = '';
                        } else {
                            errorEmail.innerHTML = 'ERROR';
                        }
                    }
                }
            });
        }
        if (cardnumber instanceof HTMLInputElement) {
            cardnumber.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const str = e.target.value.split('');
                    const errorCard = document.querySelector('.error-card');
                    if (!errorCard) return;
                    if (typeCard && str) {
                        switch (str[0]) {
                            case '':
                                typeCard.innerHTML = '';
                                break;
                            case '3':
                                typeCard.innerHTML = 'Maestro';
                                break;
                            case '4':
                                typeCard.innerHTML = 'Visa';
                                break;
                            case '5':
                                typeCard.innerHTML = 'MasterCard';
                                break;
                        }
                        if (isNaN!(+e.target.value.slice(1))) {
                            e.target.value = str.slice(0, str.length - 1).join('');
                        }
                        if (str.length < 16) {
                            errorCard.innerHTML = 'ERROR';
                        } else {
                            errorCard.innerHTML = '';
                        }
                    }
                }
            });
        }
        if (cardData instanceof HTMLInputElement) {
            cardData.addEventListener('input', (e) => {
                if (e.target instanceof HTMLInputElement) {
                    const str = e.target.value;
                    const errorCardData = document.querySelector('.error-valid');
                    if (!errorCardData) return;
                    if (str) {
                        const month = +str.slice(0, 2) <= 12 && +str.slice(0, 2) != 0;
                        const year = +str.slice(3) != 0;
                        const value = str.length > 2 ? str.slice(0, 2) + str.slice(3) : str;
                        if (isNaN(+value)) {
                            cardData.value = str.slice(0, str.length - 1);
                        }
                        if (str.length === 2) {
                            cardData.value += '/';
                        }
                        if (!errorCardData) return;
                        if (!(str.length > 4 && month && year)) {
                            errorCardData.innerHTML = 'ERROR';
                        } else {
                            errorCardData.innerHTML = '';
                        }
                    }
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
                        if (str.length < 3 || str.length > 3) {
                            errorCode.innerHTML = 'ERROR';
                        } else {
                            errorCode.innerHTML = '';
                        }
                    }
                }
            });
        }
        const error: HTMLSpanElement | NodeList | null = document.querySelectorAll('.error');
        const bthSubmit: HTMLButtonElement | null = document.querySelector('.bth-submit');
        if (bthSubmit && error) {
            bthSubmit.addEventListener('click', () => {
                const arrayResult: String[] = [];
                if (name instanceof HTMLInputElement) {
                    arrayResult.push(name.value);
                }
                if (phone instanceof HTMLInputElement) {
                    arrayResult.push(phone.value);
                }
                if (adress instanceof HTMLInputElement) {
                    arrayResult.push(adress.value);
                }
                if (email instanceof HTMLInputElement) {
                    arrayResult.push(email.value);
                }
                if (cardnumber instanceof HTMLInputElement) {
                    arrayResult.push(cardnumber.value);
                }
                if (cardData instanceof HTMLInputElement) {
                    arrayResult.push(cardData.value);
                }
                if (cvv instanceof HTMLInputElement) {
                    arrayResult.push(cvv.value);
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
                    alert('Ваш заказ принят');
                    localStorage.removeItem('cart');
                    document.querySelector('.overflow')?.remove();
                    updateCartInfo();
                    this.render();

                    setTimeout(() => {
                        router.push('/');
                        document.querySelector('.overflow')?.remove();
                    }, 3000);
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
                        overflow.remove();
                    }
                }
            });
        }
    }

    render() {
        this.getCartToShow();
        this._view && this._view.render();
    }
    onPromoInputHandler(value: string) {
        const promo = this._model.getPromo();
        const index = promo.findIndex((promo) => promo.code === value);
        if (this._view) {
            this._view.renderFoundPromo(promo[index] ? promo[index] : null);
        }
    }
    onPromoAddHandler(promo: Promo) {
        this._model.addPromo(promo);
        if (this._view) {
            this._view.renderCompletedPromo();
            this._view.renderFoundPromo(null);
        }
        const input = document.querySelector('.cart__promo-input');
        if (input instanceof HTMLInputElement) {
            input.value = '';
        }
        this.setSale();
    }
    onPromoDeleteHandler(promo: Promo) {
        this._model.removePromo(promo);
        if (this._view) {
            this._view.renderCompletedPromo();
            this._view.renderFoundPromo(null);
        }
        this.setSale();
    }

    onChangeCartCount(cart_item: CartItemComponent, action: CartAction) {
        const cart = CartModel.getCart();
        const index = cart.findIndex((item) => item.product.id === cart_item.cartItem.product.id);
        if (index === -1) return;
        if (action === CartAction.DECREASE) {
            CartModel.removeFromCart(cart[index].product);
            this.getCartToShow();
            updateCartInfo();
            if (this.cartToShow.length === 0) {
                const current = this._model.getCurrentPage();
                if (current > 1) {
                    this._model.setCurrentPage(current - 1);
                }
            }
        }
        if (action === CartAction.INCREASE) {
            CartModel.addToCart(cart[index].product);
        }
        this.getCartToShow();
        if (this._view) {
            this._view.render();
            this._view.renderCompletedPromo();
        }
        this.setSale();
    }
    onLimitInputHandler(value: string) {
        const cart = CartModel.getCart();
        const input = document.querySelector('.cart__limit-number');
        if (+value > cart.length) {
            value = cart.length.toString();
            this._model.setLimit(+value);
        } else if (+value < 1) {
            if (input instanceof HTMLInputElement) {
                input.value = '1';
            }
            this._model.setLimit(1);
        } else {
            this._model.setLimit(+value);
        }
        let leftContainer = document.querySelector('.cart__left');
        this._model.setCurrentPage(1);
        this.getCartToShow();
        const current = this._model.getCurrentPage();
        const limit = this._model.getLimit();
        setURLParams('page', current.toString());
        setURLParams('limit', limit.toString());
        if (leftContainer instanceof HTMLElement && this._view) {
            this._view.renderCartItems(leftContainer);
        }
        const currentPage = document.querySelector('.cart__pagination-wrapper span');
        if (currentPage) {
            currentPage.innerHTML = current.toString();
        }
    }
    onPrevClickHandler() {
        const currentPage = this._model.getCurrentPage();
        if (currentPage === 1) return;
        this._model.setCurrentPage(currentPage - 1);
        this.getCartToShow();
        const current = document.querySelector('.cart__pagination-wrapper span');
        if (current) {
            current.innerHTML = this._model.getCurrentPage().toString();
        }
        let leftContainer = document.querySelector('.cart__left');
        if (leftContainer instanceof HTMLElement && this._view) {
            this._view.renderCartItems(leftContainer);
        }
        setURLParams('page', this._model.getCurrentPage().toString());
    }
    onNextBtnClickHandler() {
        const currentPage = this._model.getCurrentPage();
        const allPages = this._model.getAllPages();
        if (currentPage === allPages) {
            return;
        }
        this._model.setCurrentPage(currentPage + 1);
        this.getCartToShow();
        let leftContainer = document.querySelector('.cart__left');
        const current = document.querySelector('.cart__pagination-wrapper span');
        if (current) {
            current.innerHTML = this._model.getCurrentPage().toString();
        }
        if (leftContainer instanceof HTMLElement && this._view) {
            this._view.renderCartItems(leftContainer);
        }
        setURLParams('page', this._model.getCurrentPage().toString());
    }
    setSale() {
        this._model.setSale();
        const sale = CartModel.getSale();
        const sumWithSale = CartModel.getSumWithSale();
        const infoContainer = document.querySelector('.cart__info');
        if (infoContainer) {
            const oldPrice = infoContainer.querySelector('.cart__total-sum');
            if (oldPrice instanceof HTMLElement) {
                if (sale === 0) {
                    oldPrice.classList.remove('old');
                } else {
                    oldPrice.classList.add('old');
                }
                let newPriceContainer = document.querySelector('.cart__total-sum--new');
                if (!newPriceContainer && sale !== 0) {
                    newPriceContainer = document.createElement('div');
                    newPriceContainer.classList.add('cart__total-sum', 'cart__total-sum--new');
                    newPriceContainer.innerHTML = `Сумма со скидкой: <span>${sumWithSale}</span> €`;
                    infoContainer.prepend(newPriceContainer);
                }
                if (newPriceContainer) {
                    newPriceContainer.innerHTML = `Сумма со скидкой: <span>${sumWithSale}</span> €`;
                    if (sale === 0) {
                        newPriceContainer.remove();
                        infoContainer.removeChild(newPriceContainer);
                    }
                }
            }
        }
    }
}
