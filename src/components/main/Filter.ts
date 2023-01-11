import { Component } from '../../core/component';
import { ConfigComponent, Filter, FilterCheckboxType, Product } from '../../types';
import Checkbox from './Checkbox';
import RangeSlider from './RangeSlider';

class FilterComponent extends Component {
    filter: Filter;
    filterData: Filter;
    products: Product[] = [];
    constructor(filterData: Filter,
                filter: Filter,
                products: Product[],
                config: ConfigComponent
                ) {
        super(config);
        this.filter = filter;
        this.filterData = filterData;
        this.products = products;
    }

    render() {        
        const brandsFilterBlock = document.querySelector('.filter-item.brands');        
        if (brandsFilterBlock) {
            this.renderFilterList(this.filterData.brands, brandsFilterBlock, FilterCheckboxType.BRAND);
        }
        const categoriesFilterBlock = document.querySelector('.filter-item.categories');
        if (categoriesFilterBlock) {
            this.renderFilterList(this.filterData.categories, categoriesFilterBlock, FilterCheckboxType.CATEGORY);
        }
        const priceFilterBlock = document.querySelector('.filter-item.price .filter-item__content');
        if (priceFilterBlock && priceFilterBlock instanceof HTMLElement) {
            priceFilterBlock.innerHTML = '';
            this.filter.price[0], this.filter.price[1];
            const slider = new RangeSlider(
                [this.filterData.price[0], this.filterData.price[1]],
                [this.filter.price[0], this.filter.price[1]],
                this.onPriceChange.bind(this),
                {
                    selector: priceFilterBlock,
                    template: '',
                }
            );
            slider.render();            
        }
        const stockFilterBlock = document.querySelector('.filter-item.stock .filter-item__content');
        if (stockFilterBlock && stockFilterBlock instanceof HTMLElement) {
            stockFilterBlock.innerHTML = '';
            const slider = new RangeSlider(
                [this.filterData.stock[0], this.filterData.stock[1]],
                [this.filter.stock[0], this.filter.stock[1]],
                this.onStockChange.bind(this),
                {
                    selector: stockFilterBlock,
                    template: '',
                }
            );
            slider.render();
        }
    }

    renderFilterList(arr: string[], root: Element, type: FilterCheckboxType) {
        const list = root.querySelector('.filter-item__list');
        if (list) {
            list.innerHTML = '';
            const fragment = new DocumentFragment();
            arr.forEach((item) => {
                const li = document.createElement('li');
                const checkboxItem = new Checkbox(
                    {
                        value: item,
                        name: type.toString(),
                        label: item,
                        checked: this.filter[type].includes(item),
                        disabled:
                            this.products.findIndex((pr: Product) => {
                                if (type === FilterCheckboxType.BRAND) {
                                    return pr.brand === item;
                                }
                                if (type === FilterCheckboxType.CATEGORY) {
                                    return pr.category === item;
                                }
                            }) === -1,
                    },
                    {
                        selector: li,
                        template: '',
                    }
                );
                fragment.append(li);
                checkboxItem.render();
            });
            list.innerHTML = '';
            list.append(fragment);
        }
    }
    onPriceChange(val: [number, number]) {
        let c_event = new CustomEvent("priceChanged",{detail: {
            value: val
        }});
        this.selector.dispatchEvent(c_event);
    }
    onStockChange(val: [number, number]) {
        let c_event = new CustomEvent("stockChanged",{detail: {
            value: val
        }});
        this.selector.dispatchEvent(c_event);
    }
}
export default FilterComponent;
