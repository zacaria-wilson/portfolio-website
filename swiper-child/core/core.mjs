import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

class SwiperChild extends Swiper{
    constructor(...args){
        super(...args);
        this.name = this.el.classList[0];
        this.enumerateSlides();
        return this;
    }

    inactiveSlideDimension(){
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

    enumerateSlides(){
        this.slides.forEach((slide, index) => {
            slide.setAttribute('data-hash', index.toString())
        });
    }
}

export default SwiperChild;