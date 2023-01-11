import { Component } from '../../core/component';
import { ConfigComponent } from '../../types';

class InputSearch extends Component {
    constructor(config: ConfigComponent) {
        super(config);
    }

    render() {
        this.template = `
            <div class="input-search">
                <input type="text" placeholder="Найти товар" class="input-search__input"/>
                <button class="input-search__btn"/>
            </div>`;
        super.render();
    }
}
export default InputSearch;
