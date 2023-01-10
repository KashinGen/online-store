import CartItemComponent from "../components/CartItem";
import { CartAction, CartItem, Controller } from "../types";


export class CartController extends Controller {
    cart: CartItem[] = [];
    sum: number = 0;
    count: number = 0;

    init() {        
        const cartJSON = localStorage.getItem('cart');
        this.cart = cartJSON ? JSON.parse(cartJSON) : [];
        this.render();
    }
    render() {
        const root = document.querySelector('.cart__inner');
        if (root instanceof HTMLElement) {
            this.getSumAndCount();
            if (this.cart.length !== 0) {
                this.renderCart(root);
            } else {
                this.renderEmpty(root);
            }
        }
    }
    renderCart(root: HTMLElement) {
        this.renderCartItems(root);
        this.renderCartInfo(root);
    }

    renderCartItems(root: HTMLElement) {
        let cart_list = document.querySelector('.cart__list');
        if (!(cart_list instanceof HTMLElement)) {
            cart_list = document.createElement('div');
            cart_list.className = 'cart__list';
        }
        cart_list.innerHTML = '';
        this.cart.forEach((cart_item) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const cartItemComponent = new CartItemComponent(
                cart_item,
                this.onChangeCartCount.bind(this),
                {
                    selector: cartItem,
                    template: '',
                }
            );
            cart_list?.appendChild(cartItem);
            cartItemComponent.render();    
        });
        root.append(cart_list);
    }
    onChangeCartCount(cart_item: CartItemComponent, action: CartAction) {
        const index = this.cart.findIndex((item) => item.product.id === cart_item.cartItem.product.id);        
        if (index === -1) return;
        if (action === CartAction.DECREASE) {
            if (this.cart[index].count - 1  === 0) {
                this.cart = [...this.cart.slice(0, index), ...this.cart.slice(index + 1)];
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
        btnBuy.addEventListener('click', () => {});
        btnContainer.appendChild(btnBuy);
        cartInfo.append(sumContainer, countContainer, promoContainer, btnContainer);
        root.append(cartInfo);
    }
    renderEmpty(root: HTMLElement) {
        root.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'cart__empty';
        div.innerHTML = 'Ваша корзина пуста!'
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