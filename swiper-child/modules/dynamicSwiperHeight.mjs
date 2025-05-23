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
        observer.observe(swiper.slides[swiper.realIndex]);
    }

    function resizeSwiper(){
        let activeSlideHeight = swiper.slides[swiper.realIndex].getBoundingClientRect().height; 
        swiperHeight = activeSlideHeight + ((swiper.inactiveSlideDimension() + swiper.params.spaceBetween) * (swiper.params.dynamicSwiperHeight.slidesPerView - 1));
        swiper.el.style.height = swiperHeight + 'px';
    }

    function resizeSlides(){
        swiper.slides.forEach((slide) => {
            if (swiper.params.direction === 'vertical'){
                slide.style.height = "";
            } else if (swiper.params.direction === 'horizontal'){
                slide.style.width = "";
            }
        })
    }

    function enable(){
        if (swiper.dynamicSwiperHeight.enabled) return false;
        resizeSwiper(swiper.slides[swiper.realIndex].getBoundingClientRect().height);
        swiper.dynamicSwiperHeight.enabled = true;
        return true;
    };

    function disable(){
        if (!swiper.dynamicSwiperHeight.enabled) return false;
        swiper.el.style.height = "";
        swiper.dynamicSwiperHeight.enabled = false;
        return true;
    };
    
    on('activeIndexChange', () => {
        if (swiper.dynamicSwiperHeight.enabled) {
            observe();
        };
    });

    on('slidesUpdated', () => {
        if (swiper.dynamicSwiperHeight.enabled) {
            resizeSlides();
            resizeSwiper();
        };
    });

    on('init', () => {
        if (swiper.params.dynamicSwiperHeight.enabled) {
            enable();
        };
    });

    on('destroy', () => {
        if (swiper.dynamicSwiperHeight.enabled) {
            disable();
        };
    });


    Object.assign(swiper.dynamicSwiperHeight, {
        enable,
        disable,
    });
}



