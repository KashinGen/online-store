import { fetchProducts } from '../api';
import Loader from '../components/Loader';
import Select from '../components/Select';
import InputSearch from '../components/InputSearch';
import ProductItemComponent from '../components/ProductItemComponent';
import { Controller, Product, CartItem, ProductViewMode } from '../types';
import { debounce } from '../util';
import { OrderSort, Option } from '../types/index';
import Checkbox from '../components/Checkbox';

export class MainController extends Controller {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    async init() {
        const searchWrapper = document.querySelector('.search');
        if (searchWrapper && searchWrapper instanceof HTMLElement) {
            const search = new InputSearch({
                selector: searchWrapper,
                template: '',
            });
            const selectSortWrapper = document.querySelector('.main__select-sort');

            if (selectSortWrapper && selectSortWrapper instanceof HTMLElement) {
                const optionsSort = [
                    { value: 'alphabet', order: OrderSort.ASC, label: 'По алфавиту' },
                    { value: 'price', order: OrderSort.ASC, label: 'По возрастанию цены' },
                    { value: 'price', order: OrderSort.DESC, label: 'По убыванию цены' },
                    { value: 'rating', order: OrderSort.ASC, label: 'По рейтингу' },
                ];
                let selected = optionsSort[0];
                const selectSort = new Select(
                    selected,
                    optionsSort,
                    this.onSortClickHandler.bind(this),
                    {
                        selector: selectSortWrapper,
                        template: '',
                    }
                );
                selectSort.render();
                }
                const selectViewWrapper = document.querySelector('.main__select-view');

                if (selectViewWrapper && selectViewWrapper instanceof HTMLElement) {
                const optionsView: Option[]= [
                    { value: ProductViewMode.TABLE, label: 'Таблицей' },
                    { value: ProductViewMode.LIST, label: 'Списком' },
                ];
                const selectedView = optionsView[0];
                const selectView = new Select(
                    selectedView,
                    optionsView,
                    this.onChangeViewHandler.bind(this),
                    {
                        selector: selectViewWrapper,
                        template: '',
                    }
                );
                selectView.render();
                }
            
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
                            }, 100);
                        }
                }}, 250)
            );
        }
        await this.getData();
        await this.getFilter();
    }
    async getFilter() {
        const brands: { [key: string]: boolean } = {};
        const categories: { [key: string]: boolean } = {};
        let min = 1000000;
        let max = 0;
        let minStock = 1000000;
        let maxStock = 0;
        this.products.forEach((item) => {
            if (!brands[item.brand]) {
                brands[item.brand] = true;
            }
            if (!categories[item.category]) {
                categories[item.category] = true;
            }
            min = item.price > min ? min : item.price;
            max = item.price < max ? max : item.price;
            minStock = item.stock < minStock ? item.stock : minStock;
            maxStock = item.stock > maxStock ? item.stock : maxStock;
        });
        this.renderFilter(brands, categories, min, max, minStock, maxStock)
    }
    renderFilter(brands: { [key: string]: boolean },
                 categories: { [key: string]: boolean },
                 min: number, 
                 max: number, 
                 minStock: number, 
                 maxStock: number) {
        const brandsFilterBlock = document.querySelector('.filter-item.brands');
        if (brandsFilterBlock) {
            this.renderFilterList(brands, brandsFilterBlock, 'brands')            
        }    
        const categoriesFilterBlock = document.querySelector('.filter-item.categories');
        if (categoriesFilterBlock) {
            this.renderFilterList(categories, categoriesFilterBlock, 'categories');        
        }
        const checkboxes = document.querySelectorAll('.filter-item input[type=checkbox]');          
        checkboxes.forEach((element: Element) => {
            element.addEventListener('change', (e) => {
                console.log(e);
                
            })
        });
    }
    renderFilterList(arr: { [key: string]: boolean }, root: Element, type: string) {
        const list = root.querySelector('.filter-item__list');
        if (list) {
            const fragment = new DocumentFragment();
            Object.keys(arr).forEach((brand) => {
                const li = document.createElement('li');
                const checkboxItem = new Checkbox({
                    value: brand,
                    name:type,
                    label: brand
                }, {
                    selector: li,
                    template: ''
                });
                fragment.append(li);
                checkboxItem.render();
            })
            list.innerHTML = '';
            list.append(fragment);
        }
    }
    onChangeViewHandler(select: Select, option: Option): void {
        select.changeSelection(option);
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            if (option.value === ProductViewMode.LIST) {
                list.classList.add('list');
            } else {
                list.classList.remove('list');
            }
        }
    }
    async getData() {
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            this.setLoading(list);
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
            root.innerHTML = '';
            root.append(loaderWrapper);
            loader.render();
        }
    }
    onSortClickHandler(select: Select, option: Option): void {
        select.changeSelection(option);
        const list = document.querySelector('.main__products-list');

        if (list && list instanceof HTMLElement) {
            this.setLoading(list);            
            switch(option.value) {
                case 'price': {
                    this.filteredProducts = this.filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                }
                case 'rating': {
                    this.filteredProducts = this.filteredProducts.sort((a, b) => a.rating - b.rating);
                    break;
                }
                default: {
                    this.filteredProducts = this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                }
            }
            setTimeout(() => {
                this.renderProducts(list);
            }, 100);
        }
    }

    async renderProducts(root: HTMLElement) {
        const fragment = new DocumentFragment();
        const cartJSON = localStorage.getItem('cart');
        const cart = cartJSON ? JSON.parse(cartJSON) : [];
        this.filteredProducts.forEach((product) => {
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
            card.addEventListener('click', (e) => {
                const target = e.target;
                if (target && target instanceof HTMLElement) {
                    const btn = target.closest('.product-card__add-btn');
                    if (btn) {
                        if (index !== -1) {
                            if (cart[index].product.stock > cart[index].count + 1) {
                                cart[index].count++;
                            }
                        } else {
                            cart.push({
                                product: product,
                                count: 1,
                            });
                            const btnText = btn.querySelector('.product-card__add-btn-text');
                            if (btnText) {
                                btnText.innerHTML = 'В корзине';
                            }
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
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
                    }
                }
            });
        });
        root.innerHTML = '';
        root.append(fragment);
    }
}
