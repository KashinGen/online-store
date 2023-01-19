import { Component } from '../core';
import { CartAction, ConfigComponent } from '../types';
import { CartItem } from '../types/index';

class CartItemComponent extends Component {
    cartItem: CartItem;
    callback: Function;
    constructor(model: CartItem, callback: Function, config: ConfigComponent) {
        super(config);
        this.cartItem = model;
        this.callback = callback;
    }
    render() {
        (this.template = `<a href="/detail/${this.cartItem.product.id}" target='_blank' class="router-link">
                            <div class='cart-item__img-wrapper'>
                                <div class="cart-item__img" style="background: url('${
                                    this.cartItem.product.thumbnail
                                }') center/cover"></div>
                            </div>
                        </a>
                        <div class="cart-item__content">
                            <div class="cart-item__reviews-container">
                                <div class="cart-item__rating ${this.cartItem.product.rating >= 4.5 ? 'blue' : ''}">
                                    <span class='cart-item__rating-star'></span>
                                    <span class='cart-item__rating-number'>${this.cartItem.product.rating.toFixed(
                                        1
                                    )}</span>
                                </div>
                                <div class="cart-item__price">${this.cartItem.product.price} €</div>
                            </div>
                            <a href="/detail/${
                                this.cartItem.product.id
                            }" target='_blank' class="router-link cart-item__name">
                                ${this.cartItem.product.title}
                            </a>
                            <ul class="cart-item__info">
                                <li>
                                    <span>Бренд</span>
                                    <span></span>
                                    <span>${this.cartItem.product.brand}</span>
                                </li>
                                <li>
                                    <span>Категория</span>
                                    <span></span>
                                    <span>${this.cartItem.product.category}</span>
                                </li>
                                <li>
                                    <span>В наличии</span>
                                    <span></span>
                                    <span>${this.cartItem.product.stock} шт.</span>
                                </li>
                            </ul>
                            <div style='flex: 1 1 0%'></div>
                        </div>
                        <div  class="cart-item__control">
                            <div class="cart-item__control-count">
                                <button >+</button> 
                                <span>${this.cartItem.count}</span>
                                <button>-</button>
                            </div>
                            <div class="amount-control"> 
                                <span>
                                    ${this.cartItem.count * this.cartItem.product.price}
                                <span> €
                            </div>
                        </div>
                        `),
            super.render();
        this.selector &&
            this.selector.addEventListener('click', (e) => {
                const target = e.target;
                if (target instanceof HTMLButtonElement) {
                    const content = target.textContent;
                    if (content && content === '+') {
                        this.callback(this, CartAction.INCREASE);
                        return;
                    }
                    if (content && content === '-') {
                        this.callback(this, CartAction.DECREASE);
                        return;
                    }
                }
            });
    }
}
export default CartItemComponent;
