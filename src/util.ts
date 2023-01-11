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
    return { sum, count };
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

const isNumericInput = (event: KeyboardEvent) => {
    const key = event.keyCode;
    return (
        (key >= 48 && key <= 57) || (key >= 96 && key <= 105) // Allow number pad
    );
};

export const isModifierKey = (event: KeyboardEvent) => {
    const key = event.keyCode;
    return (
        event.shiftKey === true ||
        key === 35 ||
        key === 36 || // Allow Shift, Home, End
        key === 8 ||
        key === 9 ||
        key === 13 ||
        key === 46 || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        // Allow Ctrl/Command + A,C,V,X,Z
        ((event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
    );
};

export const enforceFormat = (event: KeyboardEvent) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
        event.preventDefault();
    }
};

export const formatToPhone = (event: KeyboardEvent) => {
    if (isModifierKey(event)) return;
    const target = event.target;
    if (target instanceof HTMLInputElement) {
        const input = target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
        const areaCode = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const last = input.substring(6, 10);

        if (input.length > 6) {
            target.value = `(${areaCode}) ${middle} - ${last}`;
        } else if (length > 3) {
            target.value = `(${areaCode}) ${middle}`;
        } else if (length > 0) {
            target.value = `(${areaCode}`;
        }
    }
};
