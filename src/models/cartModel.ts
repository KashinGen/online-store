import store from '../store';
import { Promo, State } from '../types';

export class cartModel {
    _state: State;
    constructor() {
        this._state = store;
    }

    getLimit() {
        return this._state.limit;
    }
    getCurrentPage() {
        return this._state.currentPage;
    }
    getAllPages() {
        return this._state.allPages;
    }
    setAllPages(val: number) {
        this._state.allPages = val;
    }
    setLimit(val: number) {
        this._state.limit = val;
    }
    setCurrentPage(val: number) {
        this._state.currentPage = val;
    }
    getAddedPromo() {
        return this._state.addedPromo;
    }
    setSale() {
        const sale = this._state.addedPromo.reduce((acc, item) => {
            return (acc += item.percents);
        }, 0);
        this._state.cart.sale = sale;
    }
    getPromo() {
        return this._state.promo;
    }
    addPromo(promo: Promo) {
        this._state.addedPromo.push(promo);
        this.setSale();
    }
    removePromo(promo: Promo) {
        const index = this._state.addedPromo.findIndex((item) => item.code === promo.code);
        if (index !== -1) {
            this._state.addedPromo = [
                ...this._state.addedPromo.slice(0, index),
                ...this._state.addedPromo.slice(index + 1),
            ];
        }
        this.setSale();
    }
    clearCart() {
        this._state.cart.count = 0;
        this._state.cart.sale = 0;
        this._state.cart.sumWithSale = 0;
        this._state.cart.sum = 0;
        this._state.cart.cart = [];
    }
}
