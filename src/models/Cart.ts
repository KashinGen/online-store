import { Cart, CartItem, Product } from '../types';
import { getCart, getCartCount } from '../util';

class СartModel implements Cart {
    cart: CartItem[];
    count: number;
    sum: number;
    constructor() {
        this.cart = getCart();
        const { sum, count } = getCartCount(this.cart);
        this.count = count;
        this.sum = sum;
    }
    updateCart() {
        return 1;
    }

    addToCart(product: Product) {
        const index = this.findIndex(product);
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

    isAddedToCart(product: Product) {
        const index = this.cart.findIndex((item) => item.product.id === product.id);
        return index !== -1;
    }

    resetCart() {
        this.cart = [];
        this.count = 0;
        this.sum = 0;
    }

    getCart() {
        return this.cart;
    }

    getCartInfo() {
        return {
            count: this.count,
            sum: this.sum,
        };
    }

    findIndex(product: Product) {
        return this.cart.findIndex((item) => item.product.id === product.id);
    }
}

export default new СartModel();
