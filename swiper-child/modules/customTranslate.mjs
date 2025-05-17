import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

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
            cLog('translateWrapper: vertical', "0px " + translate.toString() + "px")
            swiper.wrapperEl.style.translate = "0px" + " " + translate.toString() + "px";
            return true;
        } else if (swiper.params.direction === 'horizontal') {
            cLog('translateWrapper: horizontal', translate.toString() + "px 0px")
            swiper.wrapperEl.style.translate = translate.toString() + "px 0px";
            return true;
        } else return false;
        
    };

    function enable(){
        if (swiper.params.customTranslate.enabled) return false;
        swiper.params.customTranslate.enabled = true;
        swiper.wrapperEl.style.transform = "";
        translateWrapper();
        cLog('customTranslate: enabled');
        return true;
    };

    function disable(){
        cLog('customTranslate: disabled');
        if (!swiper.params.customTranslate.enabled) return false;
        swiper.params.customTranslate.enabled = false;
        swiper.wrapperEl.style.translate = "";
        return true;
    };
    
    on('activeIndexChange', () => {
        if (swiper.params.customTranslate.enabled) {
            if (translateWrapper()){
                cLog('custom translate: ', translate);
            } else {
                eLog('Error: custom tranlsate failed')
            }
        };
    });

    on('init', () => {
        if (swiper.params.customTranslate.enabled) {
            cLog('customTranslate: init');
            enable();
        };
    });

    on('destroy', () => {
        if (swiper.params.customTranslate.enabled) {
            disable();
        };
    });


    Object.assign(swiper.customTranslate, {
        enable,
        disable,
    });
}



