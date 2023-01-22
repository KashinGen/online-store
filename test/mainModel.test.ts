import { mainModel } from '../src/models/mainModel';
import store from '../src/store';

const model = new mainModel();

describe("changeSearch", () => {
    it("set search pattern according to passed argument", () => {
      const pattern = "some text";
      model.setSearch(pattern);
      expect(store.search).toEqual(pattern);
    });
});

describe("changeStock", () => {
  it("set stock according to passed argument", () => {
    const stock = [1, 4];
    model.setStock(stock[0], stock[1]);
    expect(store.filter.stock).toEqual(stock);
    expect(store.filter.stock).not.toEqual([3, 4])
  });
});

describe("changePrice", () => {
  it("set price according to passed argument", () => {
    const price = [100, 40000];
    model.setStock(price[0], price[1]);
    expect(store.filter.stock).toEqual(price);
    expect(store.filter.stock).not.toEqual([3, 4])
  });
});