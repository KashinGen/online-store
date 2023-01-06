import { fetchProducts } from '../api';
import Loader from '../components/Loader';
import InputSearch from '../components/InputSearch';
import ProductItemComponent from '../components/ProductItemComponent';
import { ProductItem } from '../models/Product';
import { Controller, Product } from '../types';
import { debounce } from '../util';


export class MainController extends Controller {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    async init() {
        const searchWrapper = document.querySelector('.search');
        if (searchWrapper && searchWrapper instanceof HTMLElement) {
            const search = new InputSearch({ 
                selector: searchWrapper,
                template: '',
            })
            const list = document.querySelector('.main__products-list');
            search.render();
            document.querySelector('.input-search__input')?.addEventListener('input', debounce(async (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value;
                    if (list && list instanceof HTMLElement) {
                        this.setLoading(list);
                        this.filteredProducts = this.products.filter(product => {
                            return product.title.toLowerCase().includes(value) ||
                            product.brand.toLowerCase().includes(value) ||
                            product.description.toLowerCase().includes(value) ||
                            product.price.toString().includes(value) ||
                            product.stock.toString().includes(value)
                        })                    
                        setTimeout(() => {
                            this.renderProducts(list);
                        }, 100)
                    }                    
                }
            }, 250))
        }
        await this.getData();
    }
    async getData() {
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            this.setLoading(list)
            const data = await fetchProducts();
            if (data.products && data.products.length > 0) {
                this.products = data.products;
                this.filteredProducts = data.products;
                this.renderProducts(list);
            }
        }
    }
    setLoading(root: HTMLElement) {
        if (root) {
            const loaderWrapper = document.createElement('div');
            loaderWrapper.classList.add('loader');
            const loader = new Loader({
                selector: loaderWrapper,
                template: '',
            });
            root.innerHTML = ''
            root.append(loaderWrapper);
            loader.render();
        }
    }
    async renderProducts(root: HTMLElement) {
        const fragment = new DocumentFragment();
        this.filteredProducts.forEach((product) => {
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
        root.innerHTML = '';
        root.append(fragment);
    }
}
