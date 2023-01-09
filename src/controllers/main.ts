import { fetchProducts } from '../api';
import Loader from '../components/Loader';
import Select from '../components/Select';
import InputSearch from '../components/InputSearch';
import ProductItemComponent from '../components/ProductItemComponent';
import { Controller, Product, CartItem, ProductViewMode, Filter, FilterCheckboxType } from '../types';
import { debounce } from '../util';
import { OrderSort, Option } from '../types/index';
import Checkbox from '../components/Checkbox';
import RangeSlider from '../components/RangeSlider';
import router from '../router';

export class MainController extends Controller {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    optionsSort:Option[] = [
        { value: 'alphabet', order: OrderSort.ASC, label: 'По алфавиту' },
        { value: 'price', order: OrderSort.ASC, label: 'По возрастанию цены' },
        { value: 'price', order: OrderSort.DESC, label: 'По убыванию цены' },
        { value: 'rating', order: OrderSort.ASC, label: 'По рейтингу' },
    ];
    selected:Option = this.optionsSort[0];
    optionsView: Option[]= [
        { value: ProductViewMode.TABLE, label: 'Таблицей' },
        { value: ProductViewMode.LIST, label: 'Списком' },
    ];
    selectSort: Select | null = null;
    selectedView:Option = this.optionsView[0];
    search = '';
    filter: Filter = {
        brands: [],
        categories: [],
        price: [0, 0],
        stock: [0, 0],
    }
    filterData: Filter = {
        brands: [],
        categories: [],
        price: [0, 0],
        stock: [0, 0],
    }
    isPriceChanged: boolean = false;
    isStockChanged: boolean = false;
    setURLParams(param: string, value: string): void {
        const url = new URL(window.location.href);
        if (value.length !== 0) {
            url.searchParams.set(param, value);
        } else {
            url.searchParams.delete(param)
        }
        history.pushState(null, '', url);
    }
    getURLParams(): void {
        const searchParams = new URLSearchParams(window.location.search);
        const search = searchParams.get('q');
        const view = searchParams.get('view');
        const sort = searchParams.get('sort');
        const order = searchParams.get('order');
        const priceTo = searchParams.get('price-to');
        const priceFrom = searchParams.get('price-from');
        const stockTo = searchParams.get('stock-to');
        const stockFrom = searchParams.get('stock-from');
        if (view) {
            const selectedView = this.optionsView.find((item) => item.value === view);
            this.selectedView = selectedView ? selectedView : this.selectedView;
        }
        if (search) {
            this.search = search.toLowerCase();
        }
        if (sort && order) {
            const selectedSort = this.optionsSort.find((item) => item.value === sort && item.order?.toString() === order);
            this.selected = selectedSort ? selectedSort : this.selected;
        }   
        if (stockFrom && stockTo) {
            this.filter.stock = [+stockFrom, + stockTo];
            this.isStockChanged = true;
        }  
        if (priceFrom && priceTo) {
            this.filter.price = [+priceFrom, +priceTo];
            this.isPriceChanged = true;

        }            
    }

    onSearchInputHandler(value: string) {
        this.setURLParams('q', value);
        this.search = value;
        this.filterProducts();
    }

    async init() {
        const searchWrapper = document.querySelector('.search');
        this.getURLParams();
        if (searchWrapper && searchWrapper instanceof HTMLElement) {
            const search = new InputSearch({
                selector: searchWrapper,
                template: '',
            });
            const selectSortWrapper = document.querySelector('.main__select-sort');
            if (selectSortWrapper && selectSortWrapper instanceof HTMLElement) {
                selectSortWrapper.innerHTML = ''
                this.selectSort = new Select(
                    this.selected,
                    this.optionsSort,
                    this.onSortClickHandler.bind(this),
                    {
                        selector: selectSortWrapper,
                        template: '',
                    }
                );
                this.selectSort.render();
                }
                const selectViewWrapper = document.querySelector('.main__select-view');

                if (selectViewWrapper && selectViewWrapper instanceof HTMLElement) {
                    selectViewWrapper.innerHTML = ''
                const selectView = new Select(
                    this.selectedView,
                    this.optionsView,
                    this.onChangeViewHandler.bind(this),
                    {
                        selector: selectViewWrapper,
                        template: '',
                    }
                );
                selectView.render();
                if (this.selectedView !== this.optionsView[0]) {
                    this.onChangeViewHandler(selectView, this.selectedView);
                }
                }
            
            search.render();
            const searchInput = document.querySelector('.input-search__input');
            if (this.search && searchInput instanceof HTMLInputElement) {
                searchInput.value = this.search;
            }
            searchInput?.addEventListener('input', debounce(async (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value.toLowerCase();
                    this.onSearchInputHandler(value);
                }}, 250)
            );
        }
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            await this.getData(list);
            this.getFilter();
            if (this.selectSort) {
                this.onSortClickHandler(this.selectSort, this.selected)
            }
            this.filterProducts();
            await this.renderProducts(list);
        }
        if (this.search) {
            this.onSearchInputHandler(this.search);
        }
        document.querySelector('.filter__reset-btn')?.addEventListener('click', () => {
            this.filter = {
                brands: [],
                categories: [],
                price: [...this.filterData.price],
                stock: [...this.filterData.stock],
            };            
            this.filterProducts();
            this.renderFilter();
            const list = document.querySelector('.main__products-list');
            router.push('/');
            if (list && list instanceof HTMLElement) {
                this.renderProducts(list);
            }
        })
        document.querySelector('.filter__copy-btn')?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(window.location.href);
            const target = e.target;
            if (target instanceof HTMLButtonElement) {
                const content = target.textContent;
                target.textContent = 'Скопировано';
                setTimeout(() => {
                    target.textContent = content;
                }, 1500)                
            }
        })
    }

    onPriceRangeHandler(value: [number, number]) {
        if (JSON.stringify(this.filter.price) !== JSON.stringify(value)) {
            this.filter.price = value;
            this.isPriceChanged = true;
            this.setURLParams('price-from', this.filter.price[0].toString());
            this.setURLParams('price-to', this.filter.price[1].toString());
            setTimeout(() => {
                this.filterProducts()
            })
        }  
    }

    onStockRangeHandler(value: [number, number]) {
        if (JSON.stringify(this.filter.stock) !== JSON.stringify(value)) {
            this.filter.stock = value;
            this.isStockChanged = true;
            this.setURLParams('stock-from', this.filter.stock[0].toString());
            this.setURLParams('stock-to', this.filter.stock[1].toString());
            setTimeout(() => {
                this.filterProducts()
            })
        }
    }

    filterProducts() {
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            this.setLoading(list);
            let products = this.products;
            let isFilterEmpty = true;
            if (this.filter.brands.length !== 0) {
                products = products.filter((item) => {
                    return this.filter.brands.includes(item.brand)
                })
            }
            if (this.filter.categories.length !== 0) {
                isFilterEmpty = false;
                products = products.filter((item) => {                    
                    return this.filter.categories.includes(item.category)
                })
            }
            if (this.search.length !== 0) {
                const value = this.search.toLowerCase();
                products = products.filter(product => {
                    return product.title.toLowerCase().includes(value) ||
                    product.brand.toLowerCase().includes(value) ||
                    product.description.toLowerCase().includes(value) ||
                    product.price.toString().includes(value) ||
                    product.stock.toString().includes(value)
                })
            }

            if (this.isPriceChanged) {
                products = products.filter((item) => {                    
                    return item.price >= this.filter.price[0] && item.price <= this.filter.price[1]
                })
            }
            if (this.isStockChanged) {
                products = products.filter((item) => {                    
                    return item.stock >= this.filter.stock[0] && item.stock <= this.filter.stock[1]
                })
            }
            if (products.length > 0) {
                let min = 1000000;
                let max = 0;
                let minStock = 1000000;
                let maxStock = 0;
                products.forEach((item) => {
                    min = item.price > min ? min : item.price;
                    max = item.price < max ? max : item.price;
                    minStock = item.stock < minStock ? item.stock : minStock;
                    maxStock = item.stock > maxStock ? item.stock : maxStock;
                });
                if (!this.isPriceChanged || !this.isStockChanged) {
                    this.filter.price = [min, max];
                    this.filter.stock =  [minStock, maxStock];
                }
            }
            this.filteredProducts = products;
            this.renderFilter();  
            this.getFoundCount();                       
            setTimeout(() => {
                this.renderProducts(list)
            },100)
        }

    }

    getFoundCount() {
        const countContainer = document.querySelector('.main__products-found span');
        if (countContainer) {
            countContainer.innerHTML = this.filteredProducts.length.toString();
        }
    }
    getFilter() {
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
        this.filterData.brands = Object.keys(brands);
        this.filterData.categories = Object.keys(categories);
        this.filterData.price = [min, max];
        this.filterData.stock = [minStock, maxStock];
        this.filter.price = this.filter.price[0] + this.filter.price[1] === 0 ? [min, max] : this.filter.price;
        this.filter.stock = this.filter.stock[0] + this.filter.stock[1] === 0 ? [minStock, maxStock] : this.filter.stock;

        this.renderFilter();
    }
    renderFilter() {
        const brandsFilterBlock = document.querySelector('.filter-item.brands');
        if (brandsFilterBlock) {
            this.renderFilterList(this.filterData.brands, brandsFilterBlock, FilterCheckboxType.BRAND)            
        }    
        const categoriesFilterBlock = document.querySelector('.filter-item.categories');
        if (categoriesFilterBlock) {
            this.renderFilterList(this.filterData.categories, categoriesFilterBlock, FilterCheckboxType.CATEGORY);        
        }
        const priceFilterBlock = document.querySelector('.filter-item.price .filter-item__content');
        if (priceFilterBlock && priceFilterBlock instanceof HTMLElement) {
            priceFilterBlock.innerHTML = ''
            this.filter.price[0], this.filter.price[1]
            const slider = new RangeSlider([this.filterData.price[0],this.filterData.price[1]],
                        [this.filter.price[0], this.filter.price[1]], this.onPriceRangeHandler.bind(this), {
                selector: priceFilterBlock,
                template:''
            });
            slider.render();
        }
        const stockFilterBlock = document.querySelector('.filter-item.stock .filter-item__content');
        if (stockFilterBlock && stockFilterBlock instanceof HTMLElement) {
            stockFilterBlock.innerHTML = ''
            const slider = new RangeSlider([this.filterData.stock[0],this.filterData.stock[1]],
                        [this.filter.stock[0], this.filter.stock[1]], this.onStockRangeHandler.bind(this), {
                selector: stockFilterBlock,
                template:''
            });
            slider.render();
        }
        const checkboxes = document.querySelectorAll('.filter-item input[type=checkbox]');          
        checkboxes.forEach((element: Element) => {
            element.addEventListener('change', (e) => {
                const target = e.target;
                if (target && target instanceof HTMLInputElement) {
                    const type = target.name;
                    const value = target.value;
                    const checked = target.checked;                    
                    if (type === FilterCheckboxType.BRAND || type === FilterCheckboxType.CATEGORY) {
                        if (!checked) {
                            const index = this.filter[type].findIndex((item) => item === value);
                            if (index !== -1) {
                                this.filter[type] = [...this.filter[type].slice(0, index),...this.filter[type].slice(index + 1)];
                            } else {
                                this.filter[type].push(value);
                            }
                        } else {
                            this.filter[type].push(value);
                        }
                    }
                    this.filterProducts();
                }             
            })
        });
    }
    renderFilterList(arr: string[], root: Element, type: FilterCheckboxType) {
        const list = root.querySelector('.filter-item__list');
        if (list) {
            list.innerHTML = ''
            const fragment = new DocumentFragment();
            arr.forEach((item) => {
                const li = document.createElement('li');                
                const checkboxItem = new Checkbox({
                    value: item,
                    name:type.toString(),
                    label: item,
                    checked: this.filter[type].includes(item),
                    disabled: this.filteredProducts.findIndex((pr) => {
                        if (type === FilterCheckboxType.BRAND) {
                            return pr.brand === item
                        }
                        if (type === FilterCheckboxType.CATEGORY) {
                            return pr.category === item
                        }
                    }) === -1
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
                this.setURLParams('view', option.value)
            } else {
                list.classList.remove('list');
                this.setURLParams('view', '')
            }
        }
    }
    async getData(list: HTMLElement){
            this.setLoading(list);
            const data = await fetchProducts();
            if (data.products && data.products.length > 0) {
                this.products = data.products;
                this.filteredProducts = data.products;
                this.getFoundCount();
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
        if (JSON.stringify(option) !== JSON.stringify(this.selected)) {
            this.setURLParams('sort', option.value);
            this.setURLParams('order', option.order!== undefined ? option.order.toString() : '');
        }
        const list = document.querySelector('.main__products-list');

        if (list && list instanceof HTMLElement) {
            this.setLoading(list);            
            switch(option.value) {
                case 'price': {
                    if (option.order === OrderSort.ASC) {
                        this.filteredProducts = this.filteredProducts.sort((a, b) => a.price - b.price);
                    } else {
                        this.filteredProducts = this.filteredProducts.sort((a, b) => b.price - a.price);
                    }
                    break;
                }
                case 'rating': {
                    this.filteredProducts = this.filteredProducts.sort((a, b) => b.rating - a.rating);
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
