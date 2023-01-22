import { Cart, CartItem, Product } from '../types';
import { getCart, getCartCount } from '../util';

class СartModel implements Cart {
    cart: CartItem[];
    count: number;
    sum: number;
    sumWithSale: number;
    sale: number;
    constructor() {
        this.cart = getCart();
        const { sum, count } = getCartCount(this.cart);
        this.count = count;
        this.sum = sum;
        this.sumWithSale = 0;
        this.sale = 0;
    }
    removeFromCart(product: Product) {
        const index = this.findIndex(product);
        if (this.cart[index].count - 1 === 0) {
            this.cart = [...this.cart.slice(0, index), ...this.cart.slice(index + 1)];
        } else {
            this.cart[index].count -= 1;
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
        const { sum, count } = getCartCount(this.cart);
        this.count = count;
        this.sum = sum;
    }

    addToCart(product: Product) {
        const index = this.findIndex(product);
        if (index !== -1) {
            if (this.cart[index].product.stock >= this.cart[index].count + 1) {
                this.cart[index].count++;
            }
        } else {
            this.cart.push({
                product: product,
                count: 1,
            });
        }
        const { sum, count } = getCartCount(this.cart);
        this.count = count;
        this.sum = sum;
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
    getSale() {
        return this.sale;
    }
    getSumWithSale() {
        this.sumWithSale = this.sum - (this.sum * this.sale) / 100;
        return this.sumWithSale;
    }
}

export default new СartModel();
