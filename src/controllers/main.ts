import { Controller, Product, CartItem, ProductViewMode, FilterCheckboxType } from '../types';
import { debounce, getCart, setURLParams, updateCartInfo } from '../util';
import { OrderSort, Option } from '../types/index';
import router from '../router';
import { MainView } from '../view/mainView';
import { mainModel } from '../models/mainModel';
import CartModel from '../models/Cart';

export class MainController extends Controller {
    _view: MainView | null = null;
    _model: mainModel;
    constructor() {
        super();
        this._model = new mainModel();
    }
    getURLParams(): void {
        const searchParams = new URLSearchParams(window.location.search);
        const categories = searchParams.getAll('categories');
        const brands = searchParams.getAll('brands');
        const search = searchParams.get('q');
        const view = searchParams.get('view');
        const sort = searchParams.get('sort');
        const order = searchParams.get('order');
        const priceTo = searchParams.get('price-to');
        const priceFrom = searchParams.get('price-from');
        const stockTo = searchParams.get('stock-to');
        const stockFrom = searchParams.get('stock-from');
        if (view) {
            this._model.setView(view);
        }
        if (search) {
            this._model.setSearch(search.toLowerCase());
        }
        if (sort && order) {
            this._model.setSort(sort, order);
        }
        if (stockFrom && stockTo && +stockFrom && +stockTo) {
            this._model.setStock(+stockFrom, +stockTo);
        }
        if (priceFrom && priceTo && +priceFrom && +priceTo) {
            this._model.setPrice(+priceFrom, +priceTo);
        }
        if (categories) {
            this._model.setCategories(categories);
        }
        if (brands) {
            this._model.setBrands(brands);
        }
    }

    getFilter() {
        this._model.getFilter();
        this._view && this._view.renderFilter();
    }

    onSearchInputHandler(value: string) {
        setURLParams('q', value);
        this._model.setSearch(value);
        this.filterProducts();
    }

    async init() {
        const root = document.querySelector('.main__inner');
        this.getURLParams();
        if (root instanceof HTMLElement) {
            this._view = new MainView(this, root);
            this._view.render();
        }
        const searchInput = document.querySelector('.input-search__input');
        await this.getData();
        searchInput?.addEventListener(
            'input',
            debounce(async (e) => {
                const target = e.target;
                if (target instanceof HTMLInputElement) {
                    const value = target.value.toLowerCase();
                    this.onSearchInputHandler(value);
                }
            }, 250)
        );
        const selected = this._model.getSelectedSort();
        this.onSortClickHandler(selected);
        const selectedView = this._model.getSelectedView();
        const optionsView = this._model.getViewsOptions();
        if (JSON.stringify(selectedView) !== JSON.stringify(optionsView[0])) {
            this.onChangeViewHandler(selectedView);
        }
        this.getFilter();
        this.filterProducts();
        this._view && this._view.renderProducts();
        const list = document.querySelector('.main__products-list');
        list &&
            list.addEventListener('build', (e) => {
                if (e instanceof CustomEvent) {
                    const detail = e.detail;
                    if (detail) {
                        const { product } = detail;
                        CartModel.addToCart(product);
                        updateCartInfo();
                    }
                }
            });

        document.querySelector('.filter__reset-btn')?.addEventListener('click', () => {
            this._model.resetFilter();
            setURLParams('q', '');
            this._view && this._view.setLoading();
            const searchInput = document.querySelector('.input-search__input');
            if (searchInput instanceof HTMLInputElement) {
                searchInput.value = '';
                this.onSearchInputHandler('');
            }
            this.filterProducts();
            this._view && this._view.renderFilter();
            router.push('/');
            this._view && this._view.renderProducts();
        });

        document.querySelector('.filter__copy-btn')?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(window.location.href);
            const target = e.target;
            if (target instanceof HTMLButtonElement) {
                const content = target.textContent;
                target.textContent = 'Скопировано';
                setTimeout(() => {
                    target.textContent = content;
                }, 1500);
            }
        });

        const filterRoot = document.querySelector('.main__filter');
        if (filterRoot instanceof HTMLElement) {
            filterRoot.addEventListener('checkBoxEvent', (e) => {
                if (e instanceof CustomEvent) {
                    const {
                        value,
                        checked,
                        type,
                    }: { value: string; checked: boolean; type: FilterCheckboxType } = e.detail;
                    if (type === FilterCheckboxType.BRAND) {
                        this._model.changeBrand(value);
                        setURLParams(type, this._model.getBrands().join(''));
                    }
                    if (type === FilterCheckboxType.CATEGORY) {
                        this._model.changeCategory(value);
                        setURLParams(type, this._model.getCategories().join(''));
                    }
                    this._view && this._view.renderFilter();
                    this.filterProducts();
                }
            });
            filterRoot.addEventListener('priceChanged', (e) => {
                if (e instanceof CustomEvent) {
                    const value = e.detail.value;
                    if (value) {
                        this.onPriceRangeHandler(value);
                    }
                }
            });
            filterRoot.addEventListener('stockChanged', (e) => {
                if (e instanceof CustomEvent) {
                    const value = e.detail.value;
                    if (value) {
                        this.onStockRangeHandler(value);
                    }
                }
            });
        }
    }

    onPriceRangeHandler(value: [number, number]) {
        const price = this._model.getPrice();
        if (JSON.stringify(price) !== JSON.stringify(value)) {
            this._model.setPrice(...value);
            const price = this._model.getPrice();
            setURLParams('price-from', price[0].toString());
            setURLParams('price-to', price[1].toString());
            setTimeout(() => {
                this.filterProducts();
            });
        }
    }

    onStockRangeHandler(value: [number, number]) {
        const stock = this._model.getStock();
        if (JSON.stringify(stock) !== JSON.stringify(value)) {
            this._model.setStock(...value);
            const stock = this._model.getStock();
            setURLParams('stock-from', stock[0].toString());
            setURLParams('stock-to', stock[1].toString());
            setTimeout(() => {
                this.filterProducts();
            });
        }
    }

    filterProducts() {
        this._view && this._view.setLoading();
        this._model.filterProducts();
        this._view && this._view.renderFilter();
        this.getFoundCount();
        setTimeout(() => {
            this._view && this._view.renderProducts();
        }, 100);
    }

    getFoundCount() {
        const countContainer = document.querySelector('.main__products-found span');
        if (countContainer) {
            const filteredProducts = this._model.getFilteredProducts();
            countContainer.innerHTML = filteredProducts.length.toString();
        }
    }

    onChangeViewHandler(option: Option): void {
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            if (option.value === ProductViewMode.LIST) {
                list.classList.add('list');
                setURLParams('view', option.value);
            } else {
                list.classList.remove('list');
                setURLParams('view', '');
            }
        }
    }

    async getData() {
        this._view && this._view.setLoading();
        await this._model.getData();
        this.getFoundCount();
    }

    onSortClickHandler(option: Option): void {
        const selected = this._model.getSelectedSort();
        if (JSON.stringify(option) !== JSON.stringify(selected)) {
            setURLParams('sort', option.value);
            setURLParams('order', option.order !== undefined ? option.order.toString() : '');
        }
        this._model.setSort(
            option.value,
            option.order !== undefined ? option.order.toString() : OrderSort.ASC.toString()
        );
        this._view && this._view.setLoading();
        this._model.sort(option);
        setTimeout(() => {
            this._view && this._view.renderProducts();
        }, 100);
    }
}
