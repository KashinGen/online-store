import { Controller, Product } from '../types';
export declare class DetailController extends Controller {
    product: Product | null;
    activeImageIndex: number;
    init(): void;
    getProductInfo(id: string): Promise<void>;
    renderBreadCrumb(root: HTMLElement): void;
    renderProduct(root: HTMLElement): void;
    setLoading(root: HTMLElement): void;
}
