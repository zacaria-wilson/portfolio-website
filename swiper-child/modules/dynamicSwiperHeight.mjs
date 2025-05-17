import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

export default function DynamicSwiperHeight({ swiper, extendParams, on, emit }){

    extendParams({
        dynamicSwiperHeight: {
            enabled: false,
            slidesPerView: 3,
        },

    });

    swiper.dynamicSwiperHeight = {
        enabled: false,
    };

    let swiperHeight;

    const observer = new ResizeObserver((entries, observer) => {
        for (const entry of entries){
            cLog('resize observer entry');
            const prevHeight = entry.target.getBoundingClientRect().height;
            let newHeight;
            let checkLimit = 0;
            function checkSize(){
                checkLimit++;
                if (checkLimit <= 20){
                    newHeight = entry.target.getBoundingClientRect().height
                    if (newHeight !== prevHeight){
                        requestAnimationFrame(checkSize);
                    } else {
                        observer.unobserve(entry.target);
                        cLog('heightResizeObserver: height resolved')
                        resizeSwiper();
                    }
                }
                
            }
            function waitForChange(){
                setTimeout(checkSize, 100);
            }
            
            requestAnimationFrame(waitForChange);
        }
    });

    function observe(){
        cLog('dynamicSwiperHeight observe ', swiper);
        observer.observe(swiper.slides[swiper.realIndex]);
    }

    function resizeSwiper(){
        let activeSlideHeight = swiper.slides[swiper.realIndex].getBoundingClientRect().height; 
        swiperHeight = activeSlideHeight + ((swiper.inactiveSlideDimension() + swiper.params.spaceBetween) * (swiper.params.dynamicSwiperHeight.slidesPerView - 1));
        cLog('DynamicSwiperHeight: resizeSwiper swiperHeight =', swiperHeight);
        swiper.el.style.height = swiperHeight + 'px';
    }

    function resizeSlides(){
        cLog('DynamicSwiperHeight: resizeSlides')
        swiper.slides.forEach((slide) => {
            if (swiper.params.direction === 'vertical'){
                slide.style.height = "";
            } else if (swiper.params.direction === 'horizontal'){
                slide.style.width = "";
            }
        })
    }

    function init(){
        if (!swiper.params.dynamicSwiperHeight.enabled) return false;
        resizeSwiper(swiper.slides[swiper.realIndex].getBoundingClientRect().height);
    }

    function enable(){
        if (swiper.params.dynamicSwiperHeight.enabled) return false;
        swiper.params.dynamicSwiperHeight.enabled = true;
        cLog('DynamicSwiperHeight: enabled');
        return true;
    };

    function disable(){
        cLog('DynamicSwiperHeight: disabled');
        if (!swiper.params.dynamicSwiperHeight.enabled) return false;
        swiper.el.style.height = "";
        swiper.params.dynamicSwiperHeight.enabled = false;
        return true;
    };
    
    on('activeIndexChange', () => {
        if (swiper.params.dynamicSwiperHeight.enabled) {
            cLog('DynamicSwiperHeight: activeIndexChange', swiper.slides)
            observe();
        };
    });

    on('slidesUpdated', () => {
        if (swiper.params.dynamicSwiperHeight.enabled) {
            cLog('DynamicSwiperHeight: slidesUpdated')
            resizeSlides();
            resizeSwiper();
        };
    });

    on('changeDirection', () => {
        if (swiper.params.dynamicSwiperHeight.enabled) {
            cLog('DynamicSwiperHeight: changeDirection')
            //resizeSlides();
            //resizeSwiper();
        };
    });

    on('init', () => {
        if (swiper.params.dynamicSwiperHeight.enabled) {
            cLog('DynamicSwiperHeight: init');
            enable();
            init();
        };
    });

    on('destroy', () => {
        if (swiper.params.dynamicSwiperHeight.enabled) {
            disable();
        };
    });


    Object.assign(swiper.dynamicSwiperHeight, {
        enable,
        disable,
    });
}



