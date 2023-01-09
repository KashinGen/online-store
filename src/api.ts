import { Product, ProductsResponse } from './types/index';

export const fetchProducts = async (): Promise<ProductsResponse> => {
    const data = await fetch('https://dummyjson.com/products?limit=100').then((resp) => resp.json());
    return data;
};

export const getProduct = async (id: number | string): Promise<Product> => {
    const data = await fetch(`https://dummyjson.com/products/${id}`).then((resp) => resp.json());
    return data;
};
