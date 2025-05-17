import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

class SwiperChild extends Swiper{
    constructor(...args){
        super(...args);
        this.name = this.el.classList[0];
        cLog('SwiperChild', this.name, ': this =', this);
        return this;
    }

    inactiveSlideDimension(){
        cLog('inactiveSlideDimension')
        let inactiveSlide = this.el.querySelector('.swiper-slide:not(.swiper-slide-active, .swiper-slide-thumb-active');
        if (inactiveSlide) {
            if (this.params.direction === "vertical") {
                return inactiveSlide.getBoundingClientRect().height;
            } else if (this.params.direction === "horizontal") {
                return inactiveSlide.getBoundingClientRect().width;
            } else {
                eLog(this.el.classList[0],'InactiveSlideDimension')
                return -1;
            }
        } else {
            eLog(this.el.classList[0],'could not find inactive slide');
            return -1;
        }
    }
}

export default SwiperChild;