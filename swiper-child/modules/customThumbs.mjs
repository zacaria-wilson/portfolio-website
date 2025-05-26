import { cLog, eLog } from "../swiper-utils/utils.mjs";

export default function CustomThumbs({ swiper, extendParams, on, emit }){
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
        controlSwiper.slideTo(parseInt(event.currentTarget.getAttribute('data-hash')));
        emit('thumbClick', event);
    };

    function events(method){
        if (thumbSwiper){
            thumbSwiper.slides.forEach((slide) => {
                slide[method]('click', handle)
            })
        } else {eLog('Error: CustomThumbs thumbSwiper missing')}
    };

    function init(){
        if (initialized) return false;
        thumbSwiper = swiper.params.customThumbs.swiper;
        if (!thumbSwiper instanceof swiper.constructor || !thumbSwiper.initialized) return false;
        if (swiper.params.customThumbs.invert === true){
            controlSwiper = thumbSwiper;
        } else {
            controlSwiper = swiper;
        }
        initialized = true;
        return true
    }

    function enable(){
        if (swiper.customThumbs.enabled) return false;
        events('addEventListener');
        swiper.customThumbs.enabled = true;
        return true;
    };

    function disable(){
        if (!swiper.params.customThumbs.enabled) return false;
        events('removeEventListener');
        swiper.customThumbs.enabled = false;
        return true;
    };

    on('activeIndexChange', () => {
        if (swiper.customThumbs.enabled && thumbSwiper) {
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
        if (swiper.customThumbs.enabled) {
            disable();
        };
    });

    Object.assign(swiper.customThumbs, {
        enable,
        disable,
    });

}