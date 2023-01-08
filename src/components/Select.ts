import { Component } from '../core/component';
import { ConfigComponent } from '../types';
import { Option } from '../types/index';




class Select extends Component {
    selected: Option;
    eventInited: boolean = false;
    options: Option[];
    callback: Function;
    constructor(selected: Option, options: Option[], callback: Function, config: ConfigComponent) {
        super(config);
        this.options = options;
        this.selected = selected;
        this.callback = callback;
    }
    changeSelection(selected: Option) {
        this.selected = selected;
        this.render();
    }
    render() {
        this.template = `
            <div class="select">
                <div class="select__selected">
                    ${this.selected.label}
                </div>
                <ul class="select__list">
                    ${[...this.options].map(option => {
                        return `<li data-value=${JSON.stringify({value: option.value, order: option.order})}>${option.label}</li>`
                    }).join('')}
                </ul>
            </div>`;
        super.render();
        if (this.eventInited) return;
        this.eventInited = true;
        this.selector.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target instanceof HTMLElement) {
                const parent = target.closest('.select')
                if (target instanceof HTMLLIElement) {
                    if (target.dataset.value) {
                        const chosen = JSON.parse(target.dataset.value);
                        const selected = this.options.find((option) => option.value === chosen.value && option.order === chosen.order);
                        this.callback(this, selected);
                        // const c_event =  new CustomEvent('selectionChanged',{
                        //     detail: selected
                        // });
                        // dispatchEvent(c_event);
                    }
                    setTimeout(() => {
                        console.log();
                        
                        target.closest('.select')?.classList.remove('shown');
                    }, 200);
                    return;
                }
                if (target && target instanceof HTMLDivElement) {
                    if(target.classList.contains('select__selected')) {
                        target.closest('.select')?.classList.toggle('shown');
                        return;
                    }
                }
                target.closest('.select')?.classList.remove('shown');
            }
        });
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target instanceof HTMLElement) {
                if (target.classList.contains('select__selected')) return;
                const selects = document.querySelectorAll('.select');
                selects.forEach((sel) => {
                    sel.classList.remove('shown');
                })
                console.log(target.classList);
                
                console.log(target.classList.contains('select__selected'));
                
            }
        })
    }
}
export default Select;
