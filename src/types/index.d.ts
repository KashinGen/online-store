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
export declare abstract class Controller {
    init(): void;
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
export declare enum OrderSort {
    DESC = 0,
    ASC = 1
}
export declare enum ProductViewMode {
    TABLE = "table",
    LIST = "list"
}
export interface Option {
    value: string;
    order?: OrderSort;
    label: string;
}
export interface CheckboxProps {
    value: string;
    name: string;
    label: string;
    checked: boolean;
    disabled: boolean;
}
export declare enum FilterCheckboxType {
    BRAND = "brands",
    CATEGORY = "categories"
}
export interface Filter {
    brands: string[];
    categories: string[];
    price: [number, number];
    stock: [number, number];
}
