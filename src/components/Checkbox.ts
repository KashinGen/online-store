import { Component } from '../core/component';
import { ConfigComponent, CheckboxProps } from '../types';

class Checkbox extends Component {
    props: CheckboxProps;
    constructor(props: CheckboxProps, config: ConfigComponent) {
        super(config);
        this.props = props;
    }

    render() {
        this.template = `
            <label class="checkbox">
                <input type="checkbox" value="${this.props.value}" name="${this.props.name}" />
                <span class="checkmark"></span>${this.props.label}
            </label>`;
        super.render();
    }
}
export default Checkbox;
