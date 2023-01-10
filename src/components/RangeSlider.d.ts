import { Component } from '../core/component';
import { ConfigComponent } from '../types';
declare class RangeSlider extends Component {
    minmax: [number, number];
    minmaxvalue: [number, number];
    eventsInited: boolean;
    callback: Function;
    constructor(minmax: [number, number], minmaxvalue: [number, number], callback: Function, config: ConfigComponent);
    render(): void;
}
export default RangeSlider;
