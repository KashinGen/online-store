import { CartItem } from './types';

export function debounce<F extends (...params: Event[]) => void>(fn: F, delay: number) {
    let timeoutID: number | null = null;
    return function (this: Object, ...args: Event[]) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
}

export function getCartCount(cart: CartItem[]) {
    const { sum, count } = cart.reduce(
        (acc: { count: number; sum: number }, cartItem: CartItem) => {
            acc.sum += cartItem.product.price * cartItem.count;
            acc.count += cartItem.count;
            return acc;
        },
        { count: 0, sum: 0 }
    );
    return { sum, count };
}

export function updateCartInfo() {
    const cart = getCart();
    const { count, sum } = getCartCount(cart);
    const cart_sum = document.querySelector('.header__cart-info-count span');
    if (cart_sum) {
        cart_sum.innerHTML = sum.toString();
    }
    const cart_icon = document.querySelector('.header__cart-link');
    if (cart_icon) {
        cart_icon.setAttribute('data-count', count.toString());
        if (count > 0) {
            cart_icon.classList.add('on');
        }
    }
    return { sum, count };
}

export function getCart() {
    if (localStorage) {
        const cartJSON = localStorage.getItem('cart');
        const cart = cartJSON ? JSON.parse(cartJSON) : [];
        return cart;
    }
    return [];
}

export function setURLParams(param: string, value: string): void {
    const url = new URL(window.location.href);
    if (value.length !== 0) {
        url.searchParams.set(param, value);
    } else {
        url.searchParams.delete(param);
    }
    history.pushState(null, '', url);
}

export function checkValidName(value: string): boolean {
    const str = value.split(' ');
    return str.length >= 2 && str[0].length >= 3 && str[1].length >= 3;
}

export function checkValidPhone(value: string): boolean {
    const phoneAllowed = '+0123456789';
    let valid = value.split('').every((char) => phoneAllowed.includes(char));
    if (value[0] !== '+' || value.length < 10) {
        valid = false;
    }
    return valid;
}

export function checkValidAddress(value: string): boolean {
    const str = value.trim().split(' ');
    const isTrue = str.every((el) => el.length > 2);
    return str.length >= 3 && isTrue;
}

export function checkValidEmail(value: string): boolean {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    return value.length != 0 && EMAIL_REGEXP.test(value.toString());
}

export function getCardCompany(value: string): string {
    const str = value.split('');
    if (str) {
        switch (str[0]) {
            case '3':
                return 'Maestro';
            case '4':
                return 'Visa';
            case '5':
                return 'MasterCard';
            default:
                return '';
        }
    }
    return '';
}

export function checkValidCardNumber(value: string): boolean {
    const valid = value.split('').filter((item) => +item).length === 16;
    return valid;
}

export function checkValidCardData(value: string): boolean {
    const month = +value.slice(0, 2) <= 12 && +value.slice(0, 2) != 0;
    const year = +value.slice(3);
    const yearNow = new Date().getFullYear().toString().slice(2);
    return value.length > 4 && month && year >= +yearNow;
}

export function checkValidCVV(value: string): boolean {
    return value.length === 3;
}
