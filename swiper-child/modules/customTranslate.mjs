import { cLog, eLog } from "../swiper-utils/utils.mjs";

export default function CustomTranslate({ swiper, extendParams, on, emit }){
    extendParams({
        customTranslate: {
            enabled: false,
            offsetStart: 0,
        },
    });

    swiper.customTranslate = {
        enabled: false,
    };

    let translate = 0;

    function translateWrapper(){
        translate = 0;
        const inactiveSlideDimension = swiper.inactiveSlideDimension();
        if (inactiveSlideDimension > 0){
            translate = -1 * (inactiveSlideDimension + swiper.params.spaceBetween) * Math.max(0, swiper.realIndex - swiper.params.customTranslate.offsetStart);
        }
        if (swiper.params.direction === 'vertical'){
            styleWrapper("translate3d(0px, " + translate.toString() + "px, 0px)");
            return true;
        } else if (swiper.params.direction === 'horizontal') {
            styleWrapper("translate3d(" + translate.toString() + "px, 0px, 0px)");
            return true;
        } else return false;
        
    };

    function styleWrapper(styleString){
        swiper.wrapperEl.style.transform = styleString;
    }

    function enable(){
        if (swiper.customTranslate.enabled) return false;
        styleWrapper("");
        translateWrapper();
        swiper.customTranslate.enabled = true;
        return true;
    };

    function disable(){
        if (!swiper.customTranslate.enabled) return false;
        styleWrapper("");
        swiper.customTranslate.enabled = false;
        return true;
    };
    
    on('activeIndexChange', () => {
        if (swiper.customTranslate.enabled) {
            translateWrapper();
        };
    });

    on('init', () => {
        if (swiper.params.customTranslate.enabled) {
            enable();
        };
    });

    on('destroy', () => {
        if (swiper.customTranslate.enabled) {
            disable();
        };
    });


    Object.assign(swiper.customTranslate, {
        enable,
        disable,
    });
}



