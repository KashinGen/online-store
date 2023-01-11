import { CartItem } from "./types";

export function debounce<F extends (...params: Event[]) => void>(fn: F, delay: number) {
    let timeoutID: number | null = null;
    return function (this: Object, ...args: Event[]) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
}

export function updateCartInfo() {
    const cartJSON = localStorage.getItem('cart');
    const cart = cartJSON ? JSON.parse(cartJSON) : [];
    const cart_sum = document.querySelector('.header__cart-info-count span');
    const { sum, count } = cart.reduce(
        (acc: { count: number; sum: number }, cartItem: CartItem) => {
            acc.sum += cartItem.product.price * cartItem.count;
            acc.count += cartItem.count;
            return acc;
        },
        { count: 0, sum: 0 }
    );
    if (cart_sum) {
        cart_sum.innerHTML = sum;
    }
    const cart_icon = document.querySelector('.header__cart-link');
    if (cart_icon) {
        cart_icon.setAttribute('data-count', count);
        if (count > 0) {
            cart_icon.classList.add('on');
        }
    }
}

export function getCart() {
    const cartJSON = localStorage.getItem('cart');
    const cart = cartJSON ? JSON.parse(cartJSON) : [];
    return cart;
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