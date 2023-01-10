import { Component } from '../core/component';
import { ConfigComponent } from '../types';
import { Option } from '../types/index';
declare class Select extends Component {
    selected: Option;
    eventInited: boolean;
    options: Option[];
    callback: Function;
    constructor(selected: Option, options: Option[], callback: Function, config: ConfigComponent);
    changeSelection(selected: Option): void;
    render(): void;
}
export default Select;
