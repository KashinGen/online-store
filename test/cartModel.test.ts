import  cart  from '../src/models/Cart';
import { cartModel } from '../src/models/cartModel';
import { Product } from '../src/types';

const model = new cartModel();

const product: Product = {
    id: 1,
    title: '',
    description: '',
    price: 1000,
    discountPercentage: 0,
    rating: 0,
    stock: 3,
    brand: '',
    category: '',
    thumbnail: '',
    images: []
}

describe("resetCart", () => {
    it("should clear the cart", () => {
      for (let i = 0; i < product.stock; i++) {
          cart.addToCart(product);
      }
      expect(cart.count).toEqual(product.stock);
      model.clearCart();
      expect(cart.count).toEqual(0);
    });
});

describe("add to Cart", () => {
    it("set search pattern according to passed argument", () => {
      cart.addToCart(product);
      expect(cart.count).toEqual(1);
    });
    it("cannot add more than stock", () => {
      for (let i = 0; i < product.stock + 10; i++) {
        cart.addToCart(product);
      }
        expect(cart.count).toEqual(3);
      });
      it("change only count for the same product", () => {
        for (let i = 0; i < product.stock + 10; i++) {
          cart.addToCart(product);
        }
        const index = cart.findIndex(product)
        expect(index).not.toEqual(-1);
        expect(cart.cart[index].count).toEqual(product.stock);
        expect(cart.cart.length).toEqual(1);
      });
});

