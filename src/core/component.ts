import { ConfigComponent } from '../types';

export class Component {
    selector: HTMLElement | null;
    template: string;
    constructor(config: ConfigComponent) {
        this.selector = config.selector;
        this.template = config.template;
    }
    render() {
        if (this.selector) {
            this.selector.innerHTML = this.template;
        }
    }
}
