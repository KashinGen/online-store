import { Product } from "../types";

export class ProductItem implements Product {
    id: number;
    title: string;
    description:string;
    price:number;
    discountPercentage:number;
    rating:number;
    stock:number;
    brand:string;
    category:string;
    thumbnail:string;
    images:string[];
    constructor(data: Product) {
        this.id = data.id;
        this.title = data.title;
        this.brand = data.brand;
        this.price = data.price;
        this.rating = data.rating;
        this.stock = data.stock;
        this.description = data.description;
        this.discountPercentage = data.discountPercentage;
        this.category = data.category;
        this.images = data.images;
        this.thumbnail = data.thumbnail;
    }

    draw(root: DocumentFragment): void {
        const div = document.createElement("div");
        div.classList.add('product');
        const wrapper = document.createElement("div");
        wrapper.classList.add('product__wrapper');
        const ratingContainer = document.createElement("div");
        ratingContainer.classList.add('product__rating');
        const ratingNumberContainer = document.createElement("div");
        ratingContainer.classList.add('product__rating-number');
    }
}