import { ConfigComponent } from '../types';
export declare class Component {
    selector: HTMLElement;
    template: string;
    constructor(config: ConfigComponent);
    render(): void;
}
