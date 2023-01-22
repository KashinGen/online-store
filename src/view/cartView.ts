import CartItemComponent from '../components/CartItem';
import { CartController } from '../controllers/new-cart';
import { Promo } from '../types';
import CartModel from '../models/Cart';

export class CartView {
    _controller: CartController;
    _root: HTMLElement;
    constructor(controller: CartController, root: HTMLElement) {
        this._controller = controller;
        this._root = root;
    }
    render() {
        const cart = CartModel.getCart();
        const root = document.querySelector('.cart__inner');
        if (root instanceof HTMLElement) {
            let leftContainer = root.querySelector('.cart__left');
            if (!(leftContainer instanceof HTMLElement)) {
                leftContainer = document.createElement('div');
                leftContainer.className = 'cart__left';
            }

            if (cart.length !== 0) {
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
    renderEmpty(root: HTMLElement) {
        root.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'cart__empty';
        div.innerHTML = 'Ваша корзина пуста!';
        root.append(div);
    }
    renderCartInfo(root: HTMLElement) {
        const { count, sum } = CartModel.getCartInfo();
        let cartInfo = document.querySelector('.cart__info');
        if (!(cartInfo instanceof HTMLElement)) {
            cartInfo = document.createElement('div');
            cartInfo.className = 'cart__info';
        }
        cartInfo.innerHTML = '';
        // блок итоговой суммы
        const sumContainer = document.createElement('div');
        sumContainer.className = 'cart__total-sum';
        sumContainer.innerHTML = `Общая сумма: <span>${sum}</span> €`;
        // блок итогового количества
        const countContainer = document.createElement('div');
        countContainer.className = 'cart__total-count';
        countContainer.innerHTML = `Количество: <span>${count}</span>`;
        // блок введенных промо
        const completedPromo = document.createElement('div');
        completedPromo.className = 'cart__promo-completed';
        const title = document.createElement('div');
        title.className = 'cart__total-count';
        title.innerHTML = 'Введенные промокоды:';
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
                this._controller.onPromoInputHandler(value);
            }
        });
        const promoTestInfo = document.createElement('div');
        promoTestInfo.className = 'cart__promo-test';
        promoTestInfo.innerHTML = 'Коды для теста: RS, КупиЧоХошь';
        const foundPromo = document.createElement('div');
        foundPromo.className = 'promo__list';
        const content = document.createElement('div');
        content.className = 'promo__found-list';
        foundPromo.append(content);
        promoContainer.append(completedPromo, input, promoTestInfo, foundPromo);
        // блок с кнопкой
        const btnContainer = document.createElement('div');
        btnContainer.className = 'cart__btn-container';
        const btnBuy = document.createElement('button');
        btnBuy.innerHTML = 'Оформить заказ';
        btnBuy.addEventListener('click', () => this._controller.openModal());
        btnContainer.appendChild(btnBuy);
        cartInfo.append(sumContainer, countContainer, promoContainer, btnContainer);
        root.append(cartInfo);
    }

    renderFoundPromo(promo: Promo | null) {
        const root = document.querySelector('.promo__found-list');
        if (!root) return;
        root.innerHTML = '';
        if (!promo) return;
        const div = document.createElement('div');
        div.className = 'promo-item';
        const content = document.createElement('div');
        content.innerHTML = `<div class="promo">
                                <span>${promo.label}</span>
                                -
                                <span>${promo.percents} %</span>
                            </div>`;
        const addedPromo = this._controller._model.getAddedPromo();
        const item = addedPromo.find((item) => promo.code === item.code);
        if (!item) {
            const btnAdd = document.createElement('button');
            btnAdd.innerHTML = '+';
            btnAdd.addEventListener('click', (e) => {
                const isAdded = addedPromo.findIndex((item) => item.code === promo.code) !== -1;
                if (!isAdded) {
                    this._controller.onPromoAddHandler(promo);
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
        const addedPromo = this._controller._model.getAddedPromo();
        const root = document.querySelector('.cart__promo-completed');
        if (root instanceof HTMLElement) {
            root.style.display = addedPromo.length ? 'block' : 'none';
        }
        const list = document.querySelector('.cart__promo-completed ul');
        if (list) {
            const fragment = new DocumentFragment();
            addedPromo.forEach((promo) => {
                const li = document.createElement('li');
                li.className = 'promo-item';
                const content = document.createElement('div');
                content.innerHTML = `
                                        <span>${promo.label}</span>
                                        -
                                        <span>${promo.percents} %</span>`;
                const btnDelete = document.createElement('button');
                btnDelete.innerHTML = '-';
                btnDelete.addEventListener('click', (e) => {
                    this._controller.onPromoDeleteHandler(promo);
                });
                li.append(content, btnDelete);
                fragment.append(li);
            });
            list.innerHTML = '';
            list.append(fragment);
        }
    }
    renderCartItems(root: HTMLElement) {
        let cart_list = document.querySelector('.cart__list');
        if (!(cart_list instanceof HTMLElement)) {
            cart_list = document.createElement('div');
            cart_list.className = 'cart__list';
        }
        cart_list.innerHTML = '';
        this._controller.cartToShow.forEach((cart_item) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            const cartItemComponent = new CartItemComponent(
                cart_item,
                this._controller.onChangeCartCount.bind(this._controller),
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
    renderCartControls(root: HTMLElement) {
        const cart = CartModel.getCart();
        const limitCount = this._controller._model.getLimit();
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
        limitInput.max = cart.length.toString();
        limitInput.value = limitCount.toString();
        limitInput.addEventListener('input', (e) => {
            const target = e.target;
            if (target instanceof HTMLInputElement) {
                const value = target.value;
                this._controller.onLimitInputHandler(value);
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
                this._controller.onPrevClickHandler();
            }
        });
        const btnNext = document.createElement('button');
        btnNext.innerHTML = '&gt;';
        btnNext.addEventListener('click', (e) => {
            if (e.target instanceof HTMLButtonElement) {
                this._controller.onNextBtnClickHandler();
            }
        });
        const currentPage = document.createElement('span');
        currentPage.innerHTML = this._controller._model.getCurrentPage().toString();
        paginationWrapper.append(btnPrev, currentPage, btnNext);
        pagination.append(paginationSpan, paginationWrapper);
        controlsContainer.append(limit, pagination);
        cart_controls.append(title, controlsContainer);
        root.append(cart_controls);
    }
}
