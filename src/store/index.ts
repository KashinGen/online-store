import { Filter, Product, ProductViewMode, State, Option, OrderSort, Cart, Promo } from '../types';
import CartModel from '../models/Cart';

class Store implements State {
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
    selectedView: Option = this.optionsView[0];
    search = '';
    filterData: Filter = {
        brands: [],
        categories: [],
        price: [0, 0],
        stock: [0, 0],
    };
    filter: Filter = {
        brands: [],
        categories: [],
        price: [0, 0],
        stock: [0, 0],
    };
    isPriceChanged: boolean = false;
    isStockChanged: boolean = false;
    cart: Cart = CartModel;
    limit: number = 3;
    sale: number = 0;
    currentPage: number = 1;
    allPages: number = 1;
    addedPromo: Promo[] = [];
    promo: Promo[] = [
        {
            percents: 20,
            label: 'RS School',
            code: 'RS',
        },
        {
            percents: 10,
            label: 'КупиЧоХошь',
            code: 'КупиЧоХошь',
        },
    ];
}

export default new Store();
