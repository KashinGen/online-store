import { fetchProducts } from '../api';
import Loader from '../components/Loader';
import Select from '../components/Select';
import InputSearch from '../components/main/InputSearch';
import { Controller, Product, CartItem, ProductViewMode, Filter, FilterCheckboxType } from '../types';
import { debounce, getCart, setURLParams } from '../util';
import { OrderSort, Option } from '../types/index';
import router from '../router';
import ProductList from '../components/main/ProductList';
import FilterComponent from '../components/main/Filter';

export class MainController extends Controller {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    optionsSort: Option[] = [
        { value: 'alphabet', order: OrderSort.ASC, label: 'По алфавиту' },
        { value: 'price', order: OrderSort.ASC, label: 'По возрастанию цены' },
        { value: 'price', order: OrderSort.DESC, label: 'По убыванию цены' },
        { value: 'rating', order: OrderSort.ASC, label: 'По рейтингу' },
    ];
    selected: Option = this.optionsSort[0];
    optionsView: Option[] = [
        { value: ProductViewMode.TABLE, label: 'Таблицей' },
        { value: ProductViewMode.LIST, label: 'Списком' },
    ];
    selectSort: Select | null = null;
    selectedView: Option = this.optionsView[0];
    search = '';
    filter: Filter = {
        brands: [],
        categories: [],
        price: [0, 0],
        stock: [0, 0],
    };
    filterData: Filter = {
        brands: [],
        categories: [],
        price: [0, 0],
        stock: [0, 0],
    };
    isPriceChanged: boolean = false;
    isStockChanged: boolean = false;
    cart: CartItem[] = [];
    productList: ProductList | null = null;
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
            const selectedView = this.optionsView.find((item) => item.value === view);
            this.selectedView = selectedView ? selectedView : this.selectedView;
        }
        if (search) {
            this.search = search.toLowerCase();
        }
        if (sort && order) {
            const selectedSort = this.optionsSort.find(
                (item) => item.value === sort && item.order?.toString() === order
            );
            this.selected = selectedSort ? selectedSort : this.selected;
        }
        if (stockFrom && stockTo) {
            this.filter.stock = [+stockFrom, +stockTo];
            this.isStockChanged = true;
        }
        if (priceFrom && priceTo) {
            this.filter.price = [+priceFrom, +priceTo];
            this.isPriceChanged = true;
        }
        if (categories) {
            this.filter.categories.push(...categories);
        }
        if (brands) {
            this.filter.brands.push(...brands);
        }
    }

    onSearchInputHandler(value: string) {
        setURLParams('q', value);
        this.search = value;
        this.filterProducts();
    }

    async init() {
        this.products = [];
        this.filteredProducts = [];
        this.optionsSort = [
            { value: 'alphabet', order: OrderSort.ASC, label: 'По алфавиту' },
            { value: 'price', order: OrderSort.ASC, label: 'По возрастанию цены' },
            { value: 'price', order: OrderSort.DESC, label: 'По убыванию цены' },
            { value: 'rating', order: OrderSort.ASC, label: 'По рейтингу' },
        ];
        this.selected = this.optionsSort[0];
        this.optionsView = [
            { value: ProductViewMode.TABLE, label: 'Таблицей' },
            { value: ProductViewMode.LIST, label: 'Списком' },
        ];
        this.selectSort = null;
        this.selectedView = this.optionsView[0];
        this.search = '';
        this.filter = {
            brands: [],
            categories: [],
            price: [0, 0],
            stock: [0, 0],
        };
        this.filterData = {
            brands: [],
            categories: [],
            price: [0, 0],
            stock: [0, 0],
        };
        this.isPriceChanged = false;
        this.isStockChanged = false;
        this.cart = [];
        this.productList = null;
        const searchWrapper = document.querySelector('.search');
        this.getURLParams();
        this.cart = getCart();
        if (searchWrapper && searchWrapper instanceof HTMLElement) {
            const search = new InputSearch({
                selector: searchWrapper,
                template: '',
            });
            const selectSortWrapper = document.querySelector('.main__select-sort');
            if (selectSortWrapper && selectSortWrapper instanceof HTMLElement) {
                selectSortWrapper.innerHTML = '';
                this.selectSort = new Select(this.selected, this.optionsSort, this.onSortClickHandler.bind(this), {
                    selector: selectSortWrapper,
                    template: '',
                });
                this.selectSort.render();
            }
            const selectViewWrapper = document.querySelector('.main__select-view');

            if (selectViewWrapper && selectViewWrapper instanceof HTMLElement) {
                selectViewWrapper.innerHTML = '';
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
        }
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            await this.getData(list);
            this.getFilter();
            if (this.selectSort) {
                this.onSortClickHandler(this.selectSort, this.selected);
            }
            this.filterProducts();
            this.renderProducts(list);
            list.addEventListener('build', (e) => {
                if (e instanceof CustomEvent) {
                    const detail = e.detail;
                    if (detail) {
                        const { product } = detail;
                        const index = this.cart.findIndex((item) => item.product.id === product.id);
                        if (index !== -1) {
                            if (this.cart[index].product.stock > this.cart[index].count + 1) {
                                this.cart[index].count++;
                            }
                        } else {
                            this.cart.push({
                                product: product,
                                count: 1,
                            });
                        }
                        localStorage.setItem('cart', JSON.stringify(this.cart));
                    }
                }
            });
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
            this.isPriceChanged = false;
            this.isStockChanged = false;
            const searchInput = document.querySelector('.input-search__input');
            if (searchInput instanceof HTMLInputElement) {
                searchInput.value = '';
                setURLParams('q', '');
                this.onSearchInputHandler('');
                this.search = '';
            }
            this.filterProducts();
            this.renderFilter();

            const list = document.querySelector('.main__products-list');
            router.push('/');
            if (list && list instanceof HTMLElement) {
                this.renderProducts(list);
            }
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
                    if (type === FilterCheckboxType.BRAND || type === FilterCheckboxType.CATEGORY) {
                        if (checked) {
                            const index = this.filter[type].findIndex((item: string) => item === value);
                            if (index !== -1) {
                                this.filter[type] = [
                                    ...this.filter[type].slice(0, index),
                                    ...this.filter[type].slice(index + 1),
                                ];
                            } else {
                                this.filter[type].push(value);
                            }
                        } else {
                            this.filter[type].push(value);
                        }
                        setURLParams(type, this.filter[type].join(''));
                    }
                    this.renderFilter();
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
    renderFilter() {
        const filterRoot = document.querySelector('.main__filter');
        if (filterRoot instanceof HTMLElement) {
            const filter = new FilterComponent(this.filterData, this.filter, this.filteredProducts, {
                selector: filterRoot,
                template: '',
            });
            filter.render();
        }
    }

    onPriceRangeHandler(value: [number, number]) {
        if (JSON.stringify(this.filter.price) !== JSON.stringify(value)) {
            this.filter.price = value;
            this.isPriceChanged = true;
            setURLParams('price-from', this.filter.price[0].toString());
            setURLParams('price-to', this.filter.price[1].toString());
            setTimeout(() => {
                this.filterProducts();
            });
        }
    }

    onStockRangeHandler(value: [number, number]) {
        if (JSON.stringify(this.filter.stock) !== JSON.stringify(value)) {
            this.filter.stock = value;
            this.isStockChanged = true;
            setURLParams('stock-from', this.filter.stock[0].toString());
            setURLParams('stock-to', this.filter.stock[1].toString());
            setTimeout(() => {
                this.filterProducts();
            });
        }
    }

    filterProducts() {
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            this.setLoading(list);
            let products = this.products;
            if (this.filter.brands.length !== 0) {
                products = products.filter((item) => {
                    return this.filter.brands.includes(item.brand);
                });
            }
            if (this.filter.categories.length !== 0) {
                products = products.filter((item) => {
                    return this.filter.categories.includes(item.category);
                });
            }
            if (this.search.length !== 0) {
                const value = this.search.toLowerCase();
                products = products.filter((product) => {
                    return (
                        product.title.toLowerCase().includes(value) ||
                        product.brand.toLowerCase().includes(value) ||
                        product.description.toLowerCase().includes(value) ||
                        product.price.toString().includes(value) ||
                        product.stock.toString().includes(value)
                    );
                });
            }

            if (this.isPriceChanged) {
                products = products.filter((item) => {
                    return item.price >= this.filter.price[0] && item.price <= this.filter.price[1];
                });
            }

            if (this.isStockChanged) {
                products = products.filter((item) => {
                    return item.stock >= this.filter.stock[0] && item.stock <= this.filter.stock[1];
                });
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
                if (!this.isStockChanged) {
                    this.filter.stock = [minStock, maxStock];
                }
                if (!this.isPriceChanged) {
                    this.filter.price = [min, max];
                }
            }
            this.filteredProducts = products;
            this.renderFilter();
            this.getFoundCount();
            setTimeout(() => {
                this.renderProducts(list);
            }, 100);
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
        this.filter.stock =
            this.filter.stock[0] + this.filter.stock[1] === 0 ? [minStock, maxStock] : this.filter.stock;
        this.renderFilter();
    }

    onChangeViewHandler(select: Select, option: Option): void {
        select.changeSelection(option);
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
    async getData(list: HTMLElement) {
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
            setURLParams('sort', option.value);
            setURLParams('order', option.order !== undefined ? option.order.toString() : '');
        }
        const list = document.querySelector('.main__products-list');
        if (list && list instanceof HTMLElement) {
            this.setLoading(list);
            switch (option.value) {
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
    renderProducts(root: HTMLElement) {
        const list = new ProductList({
            selector: root,
            template: '',
        });
        list.render();
        list.renderProduct(this.filteredProducts, this.cart);
    }
}
