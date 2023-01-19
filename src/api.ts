import { Product, ProductsResponse } from './types/index';

export const fetchProducts = async (): Promise<ProductsResponse> => {
    try {
        const data = await fetch('https://dummyjson.com/products?limit=100');
        const res = await data.json();
        return res;
    } catch (err) {
        console.log(err);
        return {
            limit: 0,
            products: [],
            skip: 0,
            total: 0,
        };
    }
};

export const getProduct = async (id: number | string): Promise<Product | undefined> => {
    try {
        const data = await fetch(`https://dummyjson.com/products/${id}`);
        const res = await data.json();
        return res;
    } catch (err) {
        console.log(err);
    }
};
