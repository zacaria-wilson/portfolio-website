import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

export default function CustomThumbs({ swiper, extendParams, on, emit }){
    cLog('CustomThumbs')
    extendParams({
        customThumbs: {
            enabled: false,
            swiper: null,
            invert:false,
        },
    });

    swiper.customThumbs = {
        enabled: false,
    };

    let initialized = false;
    let thumbSwiper;
    let controlSwiper;

    function handle(event){
        //cLog('CustomThumbs: click handle', event.currentTarget, parseInt(event.currentTarget.getAttribute('data-hash')) - 1);
        controlSwiper.slideTo(parseInt(event.currentTarget.getAttribute('data-hash')) - 1);
        emit('thumbClick', event);
    };

    function events(method){
        cLog('CustomThumbs: events, method = ', method)
        if (thumbSwiper){
            thumbSwiper.slides.forEach((slide) => {
                slide[method]('click', handle)
                cLog('CustomThumbs: events, slide index =', slide.getAttribute('data-hash'))
                //cLog('CustomThumbs: events, slide = ', slide);
            })
        } else {eLog('Error: CustomThumbs thumbSwiper missing')}
    };

    function init(){
        if (initialized) return false;
        thumbSwiper = swiper.params.customThumbs.swiper;
        if (swiper.params.customThumbs.invert === true){
            controlSwiper = thumbSwiper;
        } else {
            controlSwiper = swiper;
        }
        events('addEventListener');
        initialized = true;
        cLog('CustomThumbs init')
        return true
    }

    function enable(){
        if (swiper.params.customThumbs.enabled) return false;
        events('addEventListener');
        swiper.params.customThumbs.enabled = true;
        cLog('CustomThumbs: enabled')
        return true;
    };

    function disable(){
        if (!swiper.params.customThumbs.enabled) return false;
        events('removeEventListener');
        swiper.params.customThumbs.enabled = false;
        return true;
    };

    on('activeIndexChange', () => {
        if (swiper.params.customThumbs.enabled && thumbSwiper) {
            cLog('CustomThumbs activeIndexChange', swiper.realIndex)
            thumbSwiper.slideTo(swiper.realIndex);
        };
    });

    on('init', () => {
        if (swiper.params.customThumbs.enabled) {
            init();
            enable();
        };
    });

    on('destroy', () => {
        if (swiper.params.customThumbs.enabled) {
            disable();
        };
    });

    Object.assign(swiper.customThumbs, {
        init,
        enable,
        disable,
    });

}