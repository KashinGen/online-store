import { Component } from '../core/component';
import { Product, ConfigComponent } from '../types';

class ProductItemComponent extends Component {
    product: Product;
    constructor(model: Product, config: ConfigComponent) {
        super(config);
        this.product = model;
    }
}
export default ProductItemComponent;
