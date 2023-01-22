import Loader from '../components/Loader';
import FilterComponent from '../components/main/Filter';
import InputSearch from '../components/main/InputSearch';
import ProductList from '../components/main/ProductList';
import Select from '../components/Select';
import { MainController } from '../controllers/main';

export class MainView {
    _controller: MainController;
    _root: HTMLElement;
    _filterRoot: HTMLElement | null;
    _productsRoot: HTMLElement | null;
    _list: ProductList;
    _filter: FilterComponent;
    _selectSort: Select | null = null;
    constructor(controller: MainController, root: HTMLElement) {
        this._controller = controller;
        this._root = root;
        this._filterRoot = document.querySelector('.main__filter');
        this._productsRoot = document.querySelector('.main__products-list');
        this._list = new ProductList({
            selector: this._productsRoot,
            template: '',
        });
        this._filter = new FilterComponent(
            this._controller._model.getFilterData(),
            this._controller._model.getFilterData(),
            this._controller._model.getFilteredProducts(),
            {
                selector: this._filterRoot,
                template: '',
            }
        );
    }
    render() {
        this.renderSearch();
        this.renderSortSelect();
        this.renderViewSelect();
    }

    setLoading() {
        if (this._productsRoot) {
            const loaderWrapper = document.createElement('div');
            loaderWrapper.classList.add('loader');
            const loader = new Loader({
                selector: loaderWrapper,
                template: '',
            });
            this._productsRoot.innerHTML = '';
            this._productsRoot.append(loaderWrapper);
            loader.render();
        }
    }

    renderFilter() {
        if (this._filterRoot instanceof HTMLElement) {
            const filter = new FilterComponent(
                this._controller._model.getFilterData(),
                this._controller._model.getFilterChecked(),
                this._controller._model.getFilteredProducts(),
                {
                    selector: this._filterRoot,
                    template: '',
                }
            );
            filter.render();
        }
    }

    renderProducts() {
        this._list.render();
        this._list.renderProduct(this._controller._model.getFilteredProducts());
    }

    renderSearch() {
        const searchWrapper = document.querySelector('.search');
        const value = this._controller._model.getSearch();
        if (searchWrapper && searchWrapper instanceof HTMLElement) {
            const search = new InputSearch({
                selector: searchWrapper,
                template: '',
            });
            search.render();
            search.setSearchValue(value);
        }
    }
    renderSortSelect() {
        const selectSortWrapper = document.querySelector('.main__select-sort');
        if (selectSortWrapper && selectSortWrapper instanceof HTMLElement) {
            const selected = this._controller._model.getSelectedSort();
            const optionsSort = this._controller._model.getSortOptions();
            selectSortWrapper.innerHTML = '';
            this._selectSort = new Select(
                selected,
                optionsSort,
                this._controller.onSortClickHandler.bind(this._controller),
                {
                    selector: selectSortWrapper,
                    template: '',
                }
            );
            this._selectSort.render();
        }
    }
    renderViewSelect() {
        const selectViewWrapper = document.querySelector('.main__select-view');
        const selectedView = this._controller._model.getSelectedView();
        const optionsView = this._controller._model.getViewsOptions();
        if (selectViewWrapper && selectViewWrapper instanceof HTMLElement) {
            selectViewWrapper.innerHTML = '';
            const selectView = new Select(
                selectedView,
                optionsView,
                this._controller.onChangeViewHandler.bind(this._controller),
                {
                    selector: selectViewWrapper,
                    template: '',
                }
            );
            selectView.render();
        }
    }
}
