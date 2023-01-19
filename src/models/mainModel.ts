import { fetchProducts, getProduct } from '../api';
import store from '../store';
import { Option, OrderSort, Product, State } from '../types';

export class mainModel {
    _state: State;
    constructor() {
        this._state = store;
    }

    setView(view: string) {
        const selectedView = this._state.optionsView.find((item: Option) => item.value === view);
        this._state.selectedView = selectedView ? selectedView : this._state.selectedView;
    }

    getFilter() {
        const brands: { [key: string]: boolean } = {};
        const categories: { [key: string]: boolean } = {};
        let min = 1000000;
        let max = 0;
        let minStock = 1000000;
        let maxStock = 0;
        this._state.products.forEach((item: Product) => {
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
        this._state.filterData.brands = Object.keys(brands);
        this._state.filterData.categories = Object.keys(categories);
        this._state.filterData.price = [min, max];
        this._state.filterData.stock = [minStock, maxStock];
        this._state.filter.price =
            this._state.filter.price[0] + this._state.filter.price[1] === 0 ? [min, max] : this._state.filter.price;
        this._state.filter.stock =
            this._state.filter.stock[0] + this._state.filter.stock[1] === 0
                ? [minStock, maxStock]
                : this._state.filter.stock;
    }

    filterProducts() {
        let products = this._state.products;
        const filter = this._state.filter;
        const search = this._state.search;
        if (filter.brands.length !== 0) {
            products = products.filter((item) => {
                return filter.brands.includes(item.brand);
            });
        }
        if (filter.categories.length !== 0) {
            products = products.filter((item) => {
                return filter.categories.includes(item.category);
            });
        }
        if (search.length !== 0) {
            const value = search.toLowerCase();
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
        if (this._state.isPriceChanged) {
            products = products.filter((item) => {
                return item.price >= filter.price[0] && item.price <= filter.price[1];
            });
        }
        if (this._state.isStockChanged) {
            products = products.filter((item) => {
                return item.stock >= filter.stock[0] && item.stock <= filter.stock[1];
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
            if (!this._state.isStockChanged) {
                filter.stock = [minStock, maxStock];
            }
            if (!this._state.isPriceChanged) {
                filter.price = [min, max];
            }
        }
        this._state.filteredProducts = products;
    }
    setSearch(s: string) {
        this._state.search = s;
    }
    setSort(sort: string, order: string) {
        const selectedSort = this._state.optionsSort.find(
            (item: Option) => item.value === sort && item.order?.toString() === order
        );
        this._state.selected = selectedSort ? selectedSort : this._state.selected;
    }
    setStock(stockFrom: number, stockTo: number) {
        this._state.filter.stock = [stockFrom, stockTo];
        this._state.isStockChanged = true;
    }
    setPrice(priceFrom: number, priceTo: number) {
        this._state.filter.price = [+priceFrom, +priceTo];
        this._state.isPriceChanged = true;
    }
    setCategories(categories: string[]) {
        this._state.filter.categories.push(...categories);
    }
    setBrands(brands: string[]) {
        this._state.filter.brands.push(...brands);
    }
    async getData() {
        const data = await fetchProducts();
        if (data.products && data.products.length > 0) {
            this._state.products = data.products;
            this._state.filteredProducts = data.products;
        }
    }
    sort(option: Option) {
        switch (option.value) {
            case 'price': {
                if (option.order === OrderSort.ASC) {
                    this._state.filteredProducts = this._state.filteredProducts.sort((a, b) => a.price - b.price);
                } else {
                    this._state.filteredProducts = this._state.filteredProducts.sort((a, b) => b.price - a.price);
                }
                break;
            }
            case 'rating': {
                this._state.filteredProducts = this._state.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            }
            default: {
                this._state.filteredProducts = this._state.filteredProducts.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
                break;
            }
        }
    }
    resetFilter() {
        this._state.filter = {
            brands: [],
            categories: [],
            price: [0, 0],
            stock: [0, 0],
        };
        this._state.search = '';
        this._state.selected = this._state.optionsSort[0];
        this._state.selectedView = this._state.optionsView[0];
        this._state.isPriceChanged = false;
        this._state.isStockChanged = false;
    }
    changeCategory(category: string) {
        const index = this._state.filter.categories.findIndex((item: string) => item === category);
        if (index !== -1) {
            this._state.filter.categories = [
                ...this._state.filter.categories.slice(0, index),
                ...this._state.filter.categories.slice(index + 1),
            ];
        } else {
            this._state.filter.categories.push(category);
        }
    }

    changeBrand(brand: string) {
        const index = this._state.filter.brands.findIndex((item: string) => item === brand);
        if (index !== -1) {
            this._state.filter.brands = [
                ...this._state.filter.brands.slice(0, index),
                ...this._state.filter.brands.slice(index + 1),
            ];
        } else {
            this._state.filter.brands.push(brand);
        }
    }
    getBrands() {
        return this._state.filter.brands;
    }
    getCategories() {
        return this._state.filter.categories;
    }
    getFilterData() {
        return this._state.filterData;
    }
    getFilterChecked() {
        return this._state.filter;
    }
    getSearch() {
        return this._state.search;
    }
    getProducts() {
        return this._state.products;
    }
    getFilteredProducts() {
        return this._state.filteredProducts;
    }
    getPrice() {
        return this._state.filter.price;
    }
    getStock() {
        return this._state.filter.stock;
    }
    getViewsOptions() {
        return this._state.optionsView;
    }
    getSelectedView() {
        return this._state.selectedView;
    }
    getSortOptions() {
        return this._state.optionsSort;
    }
    getSelectedSort() {
        return this._state.selected;
    }
}
