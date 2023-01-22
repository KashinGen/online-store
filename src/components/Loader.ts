import { Component } from '../core/component';
import { ConfigComponent } from '../types';

class Loader extends Component {
    constructor(config: ConfigComponent) {
        super(config);
    }

    render() {
        this.template = `
            <div class="loadingio-spinner-eclipse-az9zzj0al3w">
                <div class="ldio-paqfnpvpf4b">
                    <div></div>
                </div>
            </div>`;
        super.render();
    }
}
export default Loader;
