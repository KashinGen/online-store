export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export abstract class Controller {
    init(): void {}
}

export interface ConfigComponent {
    selector: HTMLElement;
    template: string;
}

export interface ProductsResponse {
    limit: number;
    products: Product[];
    skip: number;
    total: number;
}

export interface CartItem {
    product: Product;
    count: number;
}

export enum OrderSort {
    DESC,
    ASC,
}

export enum ProductViewMode {
    TABLE = 'table',
    LIST = 'list',
}

export interface Option {
    value: string;
    order?: OrderSort;
    label: string;
}
