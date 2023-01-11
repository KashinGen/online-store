import CartItemComponent from '../components/CartItem';
import { CartAction, CartItem, Controller } from '../types';

export class CartController extends Controller {
    cart: CartItem[] = [];
    cartToShow: CartItem[] = [];
    sum: number = 0;
    count: number = 0;
    limit: number = 3;
    currentPage: number = 1;
    allPages: number = 1;

    init() {
        const cartJSON = localStorage.getItem('cart');
        this.cart = cartJSON ? JSON.parse(cartJSON) : [];
        this.getCartToShow();
        this.render();
    }
    getCartToShow() {
        this.cartToShow = this.cart.slice((this.currentPage - 1) * this.limit, this.currentPage * this.limit);
        this.allPages = Math.ceil(this.cart.length / this.limit);
    }
    openModal() {
        const blockCreditCard: string = `
        <div>
        <form id="auth-card"  method="get" action="../../src/controllers/new-cart.ts">
        <div><span class='type-card'></span><input name="card" placeholder="Card number" type="number" class="cardnumber"><span class='error error-card'></span></div>
        <div class='wrapper-valid'><input placeholder='00/00' name="valid" class='valid' type='text' maxlength='5'><span class='error error-valid'></span></div>
        <div><input placeholder="Code" type="number" max='999' name="cvv" class="cvv"><span class='error error-code'></span></div>
        </form>
        </div>`;
        const BlockBuyNow: string = `<div class='overflow'>
            <div class='main-buy-now'>
            <h2>Personal details</h2>
            <form id="auth"  method="get" action="../../src/controllers/new-cart.ts">
            <div><input placeholder="Name" name="name" type="text" class="name" oninput='this.value' value=''><span class='error error-name'></span></div>
            <div><input placeholder="PhoneNumber" name="phone" type="text"  class="phone"><span class='error error-phone'></span></div>
            <div><input placeholder="Adress" name="adress" type="text" class="adress"><span class='error error-adress'></span></div>
            <div><input placeholder="E-mail" name="email" type="email" min='000' max='999' class="mail"><span class='error error-mail'></span></div>
            </form>
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
        const phone: HTMLInputElement | null = document.querySelector('.phone');
        const cardData: HTMLInputElement | null = document.querySelector('.valid');
        const typeCard: HTMLSpanElement | null = document.querySelector('.type-card');
        const formElement: HTMLFormElement | Element | null = document.getElementById('auth');
        if (formElement instanceof HTMLFormElement) {
            if (formElement)
                formElement.addEventListener('input', (e) => {
                    e.preventDefault();
                    const formData = new FormData(formElement);
                    const name = formData.get('name');
                    const str = name?.toString();
                    const strarray = str?.split(' ');
                    const errorName = document.querySelector('.error-name');
                    if (!errorName) return;
                    if (strarray) {
                        if (strarray[0].length < 3 || strarray[1].length < 3) {
                            errorName.innerHTML = 'ERROR';
                        } else {
                            errorName.innerHTML = '';
                        }
                    }
                });
            formElement.addEventListener('input', (e) => {
                e.preventDefault();
                const formData = new FormData(formElement);
                const phones = formData.get('phone');
                let str = phones?.toString();
                let phonearray = str?.split('');
                const errorName = document.querySelector('.error-phone');
                if (!errorName) return;
                if (phonearray && str && phones && phone) {
                    if (isNaN(+str.slice(1))) {
                        phone.value = phonearray.slice(0, phonearray.length - 1).join('');
                    }
                    if (phonearray.length < 9 && isNaN!(+phonearray[0])) {
                        errorName.innerHTML = 'ERROR';
                    } else {
                        errorName.innerHTML = '';
                    }
                }
            });
            formElement.addEventListener('input', (e) => {
                e.preventDefault();
                const formData = new FormData(formElement);
                const adress = formData.get('adress');
                const str = adress?.toString();
                const arrayAdress = str?.trim().split(' ');
                if (arrayAdress) {
                    const isTrue = arrayAdress.every((el) => el.length > 2);
                    const errorAddress = document.querySelector('.error-adress');
                    if (!errorAddress) return;
                    if (arrayAdress) {
                        if (!isTrue || arrayAdress.length < 3) {
                            errorAddress.innerHTML = 'ERROR';
                        } else {
                            errorAddress.innerHTML = '';
                        }
                    }
                }
                formElement.addEventListener('input', (e) => {
                    e.preventDefault();
                    const formData = new FormData(formElement);
                    const email = formData.get('email');
                    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
                    const errorEmail = document.querySelector('.error-mail');
                    if (!errorEmail) return;
                    if (email) {
                        if (EMAIL_REGEXP.test(email.toString())) {
                            errorEmail.innerHTML = '';
                        } else {
                            errorEmail.innerHTML = 'ERROR';
                        }
                    }
                });
                const formElement2: HTMLFormElement | Element | null = document.getElementById('auth-card');
                if (formElement2 instanceof HTMLFormElement) {
                    if (formElement2 !== null && Element)
                        formElement2.addEventListener('input', (e) => {
                            e.preventDefault();
                            const formData = new FormData(formElement2);
                            const card = formData.get('card');
                            const str = card?.toString();
                            const cardArray = str?.split('');
                            const errorCard = document.querySelector('.error-card');
                            if (!errorCard) return;
                            if (typeCard && cardArray) {
                                switch (cardArray[0]) {
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
                                if (cardArray.length < 16) {
                                    errorCard.innerHTML = 'ERROR';
                                } else {
                                    errorCard.innerHTML = '';
                                }
                            }
                        });
                    if (cardData !== null) {
                        formElement2.addEventListener('input', (e) => {
                            e.preventDefault();
                            const formData = new FormData(formElement2);
                            const valid = formData.get('valid');
                            const str = valid?.toString();
                            const validArray = str?.split('');
                            const errorCardData = document.querySelector('.error-valid');
                            if (str) {
                                const month = +str.slice(0, 2) <= 31 && +str.slice(0, 2) != 0;
                                const year = +str.slice(3) <= 12 && +str.slice(3) != 0;
                                const value = str.length > 2 ? str.slice(0, 2) + str.slice(3) : str;
                                if (isNaN(+value)) {
                                    cardData.value = str.slice(0, str.length - 1);
                                }
                                if (str.length === 2) {
                                    cardData.value += '/';
                                }
                                if (!errorCardData) return;
                                if (validArray) {
                                    if (!(validArray?.length > 4 && month && year)) {
                                        errorCardData.innerHTML = 'ERROR';
                                    } else {
                                        errorCardData.innerHTML = '';
                                    }
                                }
                            }
                        });
                    }
                    formElement2.addEventListener('input', (e) => {
                        e.preventDefault();
                        const formData = new FormData(formElement2);
                        const cvv = formData.get('cvv');
                        const str = cvv?.toString();
                        const cvvArray = str?.split('');
                        const errorCode = document.querySelector('.error-code');
                        if (!errorCode) return;
                        if (cvvArray) {
                            if (cvvArray.length < 3 || cvvArray.length > 3) {
                                errorCode.innerHTML = 'ERROR';
                            } else {
                                errorCode.innerHTML = '';
                            }
                        }
                    });
                    const bthSubmit: HTMLButtonElement | null = document.querySelector('.bth-submit');
                    if (bthSubmit) {
                        bthSubmit.addEventListener('click', () => {});
                    }
                }
            });
        }
    }
    render() {
        const root = document.querySelector('.cart__inner');
        if (root instanceof HTMLElement) {
            let leftContainer = root.querySelector('.cart__left');
            if (!(leftContainer instanceof HTMLElement)) {
                leftContainer = document.createElement('div');
                leftContainer.className = 'cart__left';
            }
            this.getCartToShow();
            this.getSumAndCount();
            if (this.cart.length !== 0) {
                if (leftContainer instanceof HTMLElement) {
                    console.log('sdfsdf');
                    this.renderCartControls(leftContainer);
                    this.renderCartItems(leftContainer);
                    root.append(leftContainer);
                }
                this.renderCartInfo(root);
            } else {
                this.renderEmpty(root);
            }
        }
    }
    renderCartControls(root: HTMLElement) {
        let cart_controls = document.querySelector('.cart__controls');
        if (!(cart_controls instanceof HTMLElement)) {
            cart_controls = document.createElement('div');
            cart_controls.className = 'cart__controls';
        }
        cart_controls.innerHTML = '';
        const title = document.createElement('h1');
        title.className = 'cart__title';
        title.innerHTML = 'Корзина';
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'cart__controls-container';
        // лимит товара на странице
        const limit = document.createElement('div');
        limit.className = 'cart__limit';
        const limitSpan = document.createElement('span');
        limitSpan.innerHTML = 'Товаров на странице:';
        const limitInput = document.createElement('input');
        limitInput.className = 'cart__limit-number';
        limitInput.type = 'number';
        limitInput.min = '1';
        limitInput.max = this.cart.length.toString();
        limitInput.value = this.limit.toString();
        limitInput.addEventListener('input', (e) => {
            const target = e.target;
            if (target instanceof HTMLInputElement) {
                const value = target.value;
                if (+value > this.cart.length) {
                    target.value = this.cart.length.toString();
                    this.limit = +value;
                } else if (+value < 1) {
                    target.value = '1';
                    this.limit = 1;
                } else {
                    this.limit = +value;
                }
                let leftContainer = document.querySelector('.cart__left');
                this.getCartToShow();
                this.getCartToShow();
                if (leftContainer instanceof HTMLElement) {
                    this.renderCartItems(leftContainer);
                }
                this.currentPage = 1;
                const currentPage = document.querySelector('.cart__pagination-wrapper span');
                if (currentPage) {
                    currentPage.innerHTML = this.currentPage.toString();
                }
            }
        });
        limit.append(limitSpan, limitInput);
        // блок пагинации
        const pagination = document.createElement('div');
        pagination.className = 'cart__pagination';
        const paginationWrapper = document.createElement('div');
        paginationWrapper.className = 'cart__pagination-wrapper';
        const paginationSpan = document.createElement('span');
        paginationSpan.innerHTML = 'Страница: ';
        const btnPrev = document.createElement('button');
        btnPrev.innerHTML = '&lt;';
        btnPrev.addEventListener('click', (e) => {
            if (e.target && e.target instanceof HTMLButtonElement) {
                if (this.currentPage === 1) return;
                this.currentPage -= 1;
                this.getCartToShow();
                const currentPage = document.querySelector('.cart__pagination-wrapper span');
                if (currentPage) {
                    currentPage.innerHTML = this.currentPage.toString();
                }
                let leftContainer = document.querySelector('.cart__left');
                if (leftContainer instanceof HTMLElement) {
                    this.renderCartItems(leftContainer);
                }
            }
        });
        const btnNext = document.createElement('button');
        btnNext.innerHTML = '&gt;';
        btnNext.addEventListener('click', (e) => {
            if (e.target instanceof HTMLButtonElement) {
                if (this.currentPage === this.allPages) {
                    return;
                }
                this.currentPage += 1;

                this.getCartToShow();
                console.log(this.currentPage);
                let leftContainer = document.querySelector('.cart__left');
                const currentPage = document.querySelector('.cart__pagination-wrapper span');
                if (currentPage) {
                    currentPage.innerHTML = this.currentPage.toString();
                }
                if (leftContainer instanceof HTMLElement) {
                    this.renderCartItems(leftContainer);
                }
            }
        });
        const currentPage = document.createElement('span');
        currentPage.innerHTML = this.currentPage.toString();
        paginationWrapper.append(btnPrev, currentPage, btnNext);
        pagination.append(paginationSpan, paginationWrapper);
        controlsContainer.append(limit, pagination);
        cart_controls.append(title, controlsContainer);
        root.append(cart_controls);
    }
    renderCartItems(root: HTMLElement) {
        let cart_list = document.querySelector('.cart__list');
        if (!(cart_list instanceof HTMLElement)) {
            cart_list = document.createElement('div');
            cart_list.className = 'cart__list';
        }
        cart_list.innerHTML = '';
        this.cartToShow.forEach((cart_item) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const cartItemComponent = new CartItemComponent(cart_item, this.onChangeCartCount.bind(this), {
                selector: cartItem,
                template: '',
            });
            cart_list?.appendChild(cartItem);
            cartItemComponent.render();
        });
        root.append(cart_list);
    }
    onChangeCartCount(cart_item: CartItemComponent, action: CartAction) {
        const index = this.cart.findIndex((item) => item.product.id === cart_item.cartItem.product.id);
        if (index === -1) return;
        if (action === CartAction.DECREASE) {
            if (this.cart[index].count - 1 === 0) {
                this.cart = [...this.cart.slice(0, index), ...this.cart.slice(index + 1)];
                this.getCartToShow();
                if (this.cartToShow.length === 0) {
                    if (this.currentPage > 1) {
                        this.currentPage -= 1;
                    }
                }
            } else {
                this.cart[index].count -= 1;
            }
        }
        if (action === CartAction.INCREASE) {
            if (this.cart[index].count + 1 > this.cart[index].product.stock) return;
            this.cart[index].count += 1;
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.render();
    }
    renderCartInfo(root: HTMLElement) {
        let cartInfo = document.querySelector('.cart__info');
        if (!(cartInfo instanceof HTMLElement)) {
            cartInfo = document.createElement('div');
            cartInfo.className = 'cart__info';
        }
        cartInfo.innerHTML = '';
        // блок итоговой суммы
        const sumContainer = document.createElement('div');
        sumContainer.className = 'cart__total-sum';
        sumContainer.innerHTML = `Общая сумма: <span>${this.sum}</span> €`;
        // блок итогового количества
        const countContainer = document.createElement('div');
        countContainer.className = 'cart__total-count';
        countContainer.innerHTML = `Количество: <span>${this.count}</span>`;
        // блок промокода
        const promoContainer = document.createElement('div');
        promoContainer.className = 'cart__promo-container';
        const input = document.createElement('input');
        input.className = 'cart__promo-input';
        input.setAttribute('placeholder', 'Промокод');
        const promoTestInfo = document.createElement('div');
        promoTestInfo.className = 'cart__promo-test';
        promoTestInfo.innerHTML = 'Коды для теста: RS, КупиЧоХошь';
        promoContainer.append(input, promoTestInfo);
        // блок с кнопкой
        const btnContainer = document.createElement('div');
        btnContainer.className = 'cart__btn-container';
        const btnBuy = document.createElement('button');
        btnBuy.innerHTML = 'Оформить заказ';
        btnBuy.addEventListener('click', this.openModal);
        btnContainer.appendChild(btnBuy);
        cartInfo.append(sumContainer, countContainer, promoContainer, btnContainer);
        root.append(cartInfo);
    }
    renderEmpty(root: HTMLElement) {
        root.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'cart__empty';
        div.innerHTML = 'Ваша корзина пуста!';
        root.append(div);
    }

    getSumAndCount() {
        const { sum, count } = this.cart.reduce(
            (acc: { count: number; sum: number }, cartItem: CartItem) => {
                acc.sum += cartItem.product.price * cartItem.count;
                acc.count += cartItem.count;
                return acc;
            },
            { count: 0, sum: 0 }
        );
        console.log(sum, count);
        this.sum = sum ? sum : 0;
        this.count = count ? count : 0;
        const cart_sum = document.querySelector('.header__cart-info-count span');
        if (cart_sum && cart_sum.innerHTML !== this.sum.toString()) {
            cart_sum.innerHTML = this.sum.toString();
        }
        const cart_icon = document.querySelector('.header__cart-link');
        if (cart_icon) {
            const iconCount = cart_icon.getAttribute('data-count');
            if (iconCount !== this.count.toString()) {
                cart_icon.setAttribute('data-count', this.count.toString());
                if (count > 0) {
                    cart_icon.classList.add('on');
                } else {
                    cart_icon.classList.remove('on');
                }
            }
        }
    }
}
