import { Component } from '../core/component';
import { ConfigComponent } from '../types';

class RangeSlider extends Component {
    minmax: [number, number];
    minmaxvalue: [number, number];
    eventsInited: boolean = false;
    constructor(minmax:[number, number],
                minmaxvalue: [number, number],
                callback: Function,
                config: ConfigComponent) {
        super(config);
        this.minmaxvalue = minmaxvalue;
        this.minmax = minmax;
    }

    render() {
        this.template = `
        <div class="range">
            <div class="range__values">
                <span>
                    От 
                    <span class="range__value-min">
                        ${this.minmax[0]}
                    </span>    
                </span>
                <span>
                    До 
                    <span class="range__value-max">
                        ${this.minmax[1]}
                    </span>    
                </span>
            </div>
            <div class="range__wrapper">
                <div class="range__track"></div>
                <input type="range" min="${this.minmax[0]}" max="${this.minmax[1]}" value="${this.minmaxvalue[0]}" class="range__input-min">
                <input type="range" min="${this.minmax[0]}" max="${this.minmax[1]}" value="${this.minmaxvalue[1]}" class="range__input-max">
            </div>
        </div>`
        super.render();
        if (this.eventsInited) return;
        this.eventsInited = true;
        let sliderOne = this.selector.querySelector(".range__input-min");
        let sliderTwo = this.selector.querySelector(".range__input-max");
        let displayValOne = this.selector.querySelector(".range__value-min");
        let displayValTwo = this.selector.querySelector(".range__value-max");
        let minGap = 0;
        let sliderTrack = this.selector.querySelector(".range__track");
        const sliderMax = this.selector.querySelector(".range__input-max");
        let sliderMaxValue = 100;
        if (sliderMax && sliderMax instanceof HTMLInputElement) {
            sliderMaxValue = +sliderMax.max;
        }
        if (sliderOne && sliderOne instanceof HTMLInputElement) {
            sliderOne.addEventListener("input", slideOne)
        }
        if (sliderTwo && sliderTwo instanceof HTMLInputElement) {
            sliderTwo.addEventListener("input", slideTwo)
        }
        slideOne();
        slideTwo();
        function slideOne(){            
            if (sliderOne && sliderTwo && sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {                
                if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
                    sliderOne.value = (parseInt(sliderTwo.value) - minGap).toString();
                }
                if (displayValOne) {                    
                    displayValOne.textContent = sliderOne.value;
                }
                fillColor();
            }
        }
        function slideTwo(){
            if (sliderOne && sliderTwo && sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {
                if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
                    sliderTwo.value = (parseInt(sliderOne.value) + minGap).toString();
                }
                if (displayValTwo) {
                    displayValTwo.textContent = sliderTwo.value;
                }
                fillColor();

            }
        }
        function fillColor() {
            if (sliderOne && sliderTwo && sliderOne instanceof HTMLInputElement && sliderTwo instanceof HTMLInputElement) {
                const percent1: number = (+sliderOne.value / sliderMaxValue) * 100;
                const percent2: number = (+sliderTwo.value / sliderMaxValue) * 100;
                if (sliderTrack && sliderTrack instanceof HTMLElement) {
                    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #151517 ${percent1}% , #151517 ${percent2}%, #dadae5 ${percent2}%)`;

                }
            }
        }
    }
}
export default RangeSlider;
