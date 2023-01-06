import { fetchProducts } from '../api';
import Loader from '../components/Loader';
import ProductItemComponent from '../components/ProductItemComponent';
import { ProductItem } from '../models/Product';
import { Controller, Product } from '../types';

export class MainController extends Controller {
    products: Product[] = [];
    async init() {
        await this.getData();
    }
    async getData() {
        const list = document.querySelector('.main__products-list');
        if (list) {
            const loaderWrapper = document.createElement('div');
            loaderWrapper.classList.add('loader');
            const loader = new Loader({
                selector: loaderWrapper,
                template: '',
            });
            list.append(loaderWrapper);
            loader.render();
            const fragment = new DocumentFragment();
            const data = await fetchProducts();
            if (data.products && data.products.length > 0) {
                this.products = data.products;
                this.products.forEach((product) => {
                    const productModel = new ProductItem(product);
                    const card = document.createElement('div');
                    card.classList.add('product-card');
                    const productComponent = new ProductItemComponent(productModel, {
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
                            <span>В корзину</span>
                            <span class='product-card__add-btn-icon'></span>
                        </button>
                        `,
                    });
                    fragment.append(card);
                    productComponent.render();
                });
                list.innerHTML = '';
                list.append(fragment);
            }
        }
    }
}
