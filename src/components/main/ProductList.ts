import { Component } from '../../core/component';
import { CartItem, ConfigComponent } from '../../types';
import { Product } from '../../types/index';
import ProductItemComponent from './ProductItemComponent';
import { updateCartInfo } from '../../util';

class ProductList extends Component {
    constructor(config: ConfigComponent) {
        super(config);
    }

    render() {
        super.render();
    }

    renderProduct(list: Product[], cart: CartItem[]) {
        this.selector.innerHTML = '';
        if (list.length !== 0) {
            const fragment = new DocumentFragment();
            list.forEach((product) => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                const index = cart.findIndex((item: CartItem) => item.product.id === product.id);
                const isInCart = index !== -1;
                const productComponent = new ProductItemComponent(product, {
                    selector: card,
                    template: `<a href="/detail/${product.id}" target='_blank' class="router-link">
                        <div class='product-card__img-wrapper'>
                            <div class="product-card__img" style="background: url('${
                                product.thumbnail
                            }') center/cover"></div>
                        </div>
                    </a>
                    <div class="product-card__content">
                        <div class="product-card__reviews-container">
                            <div class="product-card__rating ${product.rating >= 4.5 ? 'blue' : ''}">
                                <span class='product-card__rating-star'></span>
                                <span class='product-card__rating-number'>${product.rating.toFixed(1)}</span>
                            </div>
                            <div class="product-card__price">${product.price} €</div>
                        </div>
                        <a href="/detail/${product.id}" target='_blank' class="router-link product-card__name">
                            ${product.title}
                        </a>
                        <ul class="product-card__info">
                            <li>
                                <span>Бренд</span>
                                <span></span>
                                <span>${product.brand}</span>
                            </li>
                            <li>
                                <span>Категория</span>
                                <span></span>
                                <span>${product.category}</span>
                            </li>
                            <li>
                                <span>В наличии</span>
                                <span></span>
                                <span>${product.stock} шт.</span>
                            </li>
                        </ul>
                        <div style='flex: 1 1 0%'></div>
                    </div>
                    <button class='product-card__add-btn'>
                        <span class='product-card__add-btn-text'>${isInCart ? 'В корзине' : 'В корзину'}</span>
                        <span class='product-card__add-btn-icon'></span>
                    </button>
                    `,
                });
                fragment.append(card);
                productComponent.render();
                card.onclick = (e) => {
                    const target = e.target;
                    if (target instanceof HTMLElement) {
                        let c_event = new CustomEvent('build', {
                            detail: {
                                index: index,
                                product: product,
                            },
                        });
                        this.selector.dispatchEvent(c_event);
                        const btn = target.closest('.product-card__add-btn');
                        if (btn) {
                            if (index === -1) {
                                const btnText = btn.querySelector('.product-card__add-btn-text');
                                if (btnText) {
                                    btnText.innerHTML = 'В корзине';
                                }
                            }
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCartInfo();
                        }
                    }
                };
            });
            this.selector.innerHTML = '';
            this.selector.append(fragment);
        } else {
            const notFoundWrapper = document.createElement('div');
            notFoundWrapper.className = 'main__not-found';
            notFoundWrapper.innerHTML = 'Ой, сори, мы не нашли товаров :(';
            this.selector.innerHTML = '';
            this.selector.append(notFoundWrapper);
        }
    }
}
export default ProductList;
