import { Component } from '../../core/component';
import { ConfigComponent, CheckboxProps } from '../../types';

class Checkbox extends Component {
    props: CheckboxProps;
    constructor(props: CheckboxProps, config: ConfigComponent) {
        super(config);
        this.props = props;
    }

    render() {
        this.template = `
            <label class="checkbox ${this.props.disabled && !this.props.checked ? 'disabled' : ''}">
                <input  type="checkbox" 
                        value="${this.props.value}" 
                        name="${this.props.name}" 
                        ${this.props.checked ? 'checked' : ''}
                        ${this.props.disabled && !this.props.checked ? 'disabled' : ''}
                        />
                <span class="checkmark"></span>${this.props.label}
            </label>`;
        super.render();
        const input = this.selector.querySelector('input[type=checkbox]');
        if (input instanceof HTMLInputElement)  {
            input.addEventListener('change', (e) => {
                let c_event = new CustomEvent("checkBoxEvent",{detail: {
                    value: this.props.value,
                    checked: this.props.checked,
                    type: this.props.name
                }});
                const filterRoot = document.querySelector('.main__filter');
                filterRoot?.dispatchEvent(c_event);
            })
        }

    }
}
export default Checkbox;
