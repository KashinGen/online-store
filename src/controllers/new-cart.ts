import CartItemComponent from "../components/CartItem";
import { CartAction, CartItem, Controller, Promo } from "../types";


export class CartController extends Controller {
    cart: CartItem[] = [];
    cartToShow: CartItem[] = [];
    sum: number = 0;
    count: number = 0;
    limit: number = 3;
    currentPage: number = 1;
    allPages: number = 1;
    addedPromo: Promo[] = [];
    promo: Promo[] = [
        {
            percents: 20,
            label: 'RS',
            code: 'RS'
        },
        {
            percents: 10,
            label: 'КупиЧоХошь',
            code: 'КупиЧоХошь'
        }
    ]
    init() {        
        const cartJSON = localStorage.getItem('cart');
        this.cart = cartJSON ? JSON.parse(cartJSON) : [];
        this.sum = 0;
        this.count = 0;
        this.limit = 3;
        this.currentPage = 1;
        this.allPages = 1;
        this.getCartToShow();
        this.render();
        this.addedPromo = [];
    }
    getCartToShow() {
        this.cartToShow = this.cart.slice((this.currentPage - 1) * this.limit, this.currentPage * this.limit);
        this.allPages = Math.ceil(this.cart.length / this.limit); 
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
                    this.limit = + value;
                }
                let leftContainer = document.querySelector('.cart__left');                this.getCartToShow();
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
        const paginationWrapper = document.createElement('div')
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
        // блок введенных промо
        const completedPromo = document.createElement('div');
        completedPromo.className = 'cart__promo-completed';
        const title = document.createElement('div');
        title.className = 'cart__total-count';
        title.innerHTML = 'Введенные промокоды:'
        const list = document.createElement('ul');
        completedPromo.append(title, list);
        completedPromo.style.display = 'none';

        // блок промокода
        const promoContainer = document.createElement('div');
        promoContainer.className = 'cart__promo-container';
        const input = document.createElement('input');
        input.className = 'cart__promo-input';
        input.setAttribute('placeholder', 'Промокод');
        input.addEventListener('input', (e) => {
            const target = e.target;
            if (target instanceof HTMLInputElement) {
                const value = target.value;
                    const index = this.promo.findIndex((promo) => promo.code === value);
                    this.renderFoundPromo(this.promo[index] ? this.promo[index] : null);                    
            }
        })
        const promoTestInfo = document.createElement('div');
        promoTestInfo.className = 'cart__promo-test';
        promoTestInfo.innerHTML = 'Коды для теста: RS, КупиЧоХошь';
        const foundPromo = document.createElement('div');
        foundPromo.className = 'promo';
        const content = document.createElement('div');
        content.className = 'promo__found-list';
        foundPromo.append(content);
        promoContainer.append(completedPromo, input, promoTestInfo, foundPromo);
        // блок с кнопкой
        const btnContainer = document.createElement('div');
        btnContainer.className = 'cart__btn-container';
        const btnBuy = document.createElement('button');
        btnBuy.innerHTML = 'Оформить заказ';
        btnBuy.addEventListener('click', (e) => {

        });
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

    renderFoundPromo(promo: Promo | null) {
        const root = document.querySelector('.promo__found-list');
        if (!root) return;
        root.innerHTML = '';
        if (!promo) return;
        const div = document.createElement('div');
        div.className = 'promo';
        const content = document.createElement('div');
        content.innerHTML = `<div class="promo">
                                <span>${promo.label}</span>
                                -
                                <span>${promo.percents} %</span>
                            </div>`
        const item = this.addedPromo.find((item) => promo.code === item.code);
        if (!item) {
            const btnAdd = document.createElement('button');
            btnAdd.innerHTML = '+';
            btnAdd.addEventListener('click', (e) => {
                const isAdded = this.addedPromo.findIndex((item) => item.code === promo.code) !== -1;
                if (!isAdded) {
                    this.addedPromo.push(promo);
                    this.renderCompletedPromo();
                    this.renderFoundPromo(promo);
                }
            });
            div.append(content, btnAdd);
        } else {
            div.append(content);
        }

        if (root) {
            root.append(div);
        }
    }
    renderCompletedPromo() {
            const root = document.querySelector('.cart__promo-completed');
            if (root instanceof HTMLElement) {
                root.style.display = this.addedPromo.length ? 'block' : 'none';
            }
            const list =  document.querySelector('.cart__promo-completed ul');
            if (list) {
                const fragment = new DocumentFragment();
                this.addedPromo.forEach((promo) => {
                    const li = document.createElement('li');
                    const content = document.createElement('div');
                    content.className = 'promo';
                    content.innerHTML = `
                                        <span>${promo.label}</span>
                                        -
                                        <span>${promo.percents} %</span>`
                    const btnDelete = document.createElement('button');
                    btnDelete.innerHTML = '-';
                    btnDelete.addEventListener('click', (e) => {
                        const index = this.addedPromo.findIndex((item) => item.code === promo.code);
                        if (index !== -1) {
                            this.addedPromo = [...this.addedPromo.slice(0, index), ...this.addedPromo.slice(index + 1)];
                            this.renderCompletedPromo();
                        }
                    });
                    li.append(content, btnDelete);
                    fragment.append(li);
                });
                list.innerHTML = '';
                list.append(fragment);
            }
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