import { Product, ProductsResponse } from './types/index';
export declare const fetchProducts: () => Promise<ProductsResponse>;
export declare const getProduct: (id: number | string) => Promise<Product>;
