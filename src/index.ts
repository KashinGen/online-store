import '../assets/style/style.scss';
import router from './router';
import { URLRoute } from './router/types';
import { CartItem, Controller } from './types/index';

window.onpopstate = router.urlLocationHandler;
declare global {
    interface Window {
        route: URLRoute;
        controller: Controller;
    }
}
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
const w = window;
w.route = router.routes;
router.urlLocationHandler();
