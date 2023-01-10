import { Component } from '../core/component';
import { ConfigComponent, CheckboxProps } from '../types';
declare class Checkbox extends Component {
    props: CheckboxProps;
    constructor(props: CheckboxProps, config: ConfigComponent);
    render(): void;
}
export default Checkbox;
