import { Component } from '../core/component';
import { Product, ConfigComponent } from '../types';
declare class ProductItemComponent extends Component {
    product: Product;
    constructor(model: Product, config: ConfigComponent);
}
export default ProductItemComponent;
