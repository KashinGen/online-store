import CartItemComponent from "../components/CartItem";
import { CartAction, CartItem, Controller } from "../types";


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
    render() {
        const root = document.querySelector('.cart__inner');
        if (root instanceof HTMLElement) {
            let leftContainer = root.querySelector('.cart__left');
            console.log('sdfs');
            
            if (!(leftContainer instanceof HTMLElement)) {
                leftContainer = document.createElement('div');
                leftContainer.className = 'cart__left';
            }
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
        limitInput.max = this.allPages.toString();
        limitInput.value = this.currentPage.toString();
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
                    this.limit = + value;
                }
            }
        });
        limit.append(limitSpan, limitInput);
        // блок пагинации
        const pagination = document.createElement('div');
        pagination.className = 'cart__pagination';
        const btnPrev = document.createElement('button');
        btnPrev.textContent = '&lt;';
        btnPrev.addEventListener('click', (e) => {
            const target = e.target;
            if (target instanceof HTMLButtonElement) {
                if (+target.value < 0) {
                    target.value = '1';
                    this.currentPage = 1;
                } else {
                    this.currentPage = +target.value;
                }
            }
        });
        const btnNext = document.createElement('button');
        btnNext.textContent = '&gt;';
        btnNext.addEventListener('click', (e) => {
            const target = e.target;
            if (target instanceof HTMLButtonElement) {
                if (+target.value > this.allPages) {
                    target.value = this.allPages.toString();
                    this.currentPage = this.allPages;
                } else {
                    this.currentPage = +target.value;
                }
            }
        });
        const currentPage = document.createElement('span');
        currentPage.innerHTML = this.currentPage.toString();
        pagination.append(btnPrev, currentPage, btnNext);

        controlsContainer.append(limit, pagination);

        cart_controls.append(title, controlsContainer);
        console.log(cart_controls);
        
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