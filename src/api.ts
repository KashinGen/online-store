import { ProductsResponse } from './types/index';

// export const fetchProducts = async (): Promise<ProductsResponse> => {
//     const data = await fetch('https://dummyjson.com/products?limit=100').then((resp) => resp.json());
//     return data;
// };

export const fetchProducts = async (): Promise<ProductsResponse> => {
    const data = await fetch('./db.json').then((resp) => resp.json());
    return data;
};
