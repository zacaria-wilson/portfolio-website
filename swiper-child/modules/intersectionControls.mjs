import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

export default function IntersectionControls({ swiper, extendParams, on, emit }){

    extendParams({
        intersectionControls: {
            enabled: false,
            scroll: false,
            transitionPoint: null,
            observerOptions: {
                root: null,
                rootMargin: '0px',
                threshold: null
            }
        },

    });

    swiper.intersectionControls = {
        enabled: false,
    };

    let slideObserver;
    let transitionPoint;
    let controlSwiper;

    function generateThresholds(){
        let thresholds = [];

        for(let i = 0.01; i < 1; i += 0.01){
            thresholds.push(Number.parseFloat(i.toFixed(2)));
        }
        cLog('generateThresholds, swiper.params.intersectionControls = ', swiper.intersectionControls)
        swiper.params.intersectionControls.observerOptions.threshold = thresholds;
    }

    const handle = (entries, observer) => {
        for (const entry of entries){
            const index = entry.target.getAttribute('data-hash') - 1;
            const top = entry.boundingClientRect.top;
            const bottom = entry.boundingClientRect.bottom + swiper.params.spaceBetween;
            const target = entry.target; 
            //cLog('intersection observer entry', index);
            //cLog('top = ', top, ' bottom =', bottom)
            //cLog(top <= transitionPoint, bottom > transitionPoint)
            if (!entry.isIntersecting){
                cLog('unobserving entry', index)
                observer.unobserve(target);
            } else {
                if (top <= transitionPoint && bottom > transitionPoint){
                    cLog('entry within bounds', index);
                    if (index != controlSwiper.realIndex){
                        cLog('updating active slide', index);
                        controlSwiper.slideTo(index);
                        return;
                    }
                }
                if (top > transitionPoint){
                    cLog('observer PREV', index - 1, top, transitionPoint);
                    observer.unobserve(target);
                    controlSwiper.slideTo(index - 1);
                    observer.observe(swiper.slides[index - 1]);
                    return;
                }
                if (bottom < transitionPoint && index < (swiper.slides.length - 1)){
                    cLog('observer NEXT', index + 1, swiper.slides.length, bottom, transitionPoint);
                    observer.unobserve(target);
                    controlSwiper.slideTo(index + 1);
                    observer.observe(swiper.slides[index + 1]);
                    return;
                }
            }
            
        }
    };

    async function scrollTo(index){
        const originalPosition = swiper.slides[index].getBoundingClientRect().top + window.scrollY - swiper.params.spaceBetween;
        let slideTop = 0;
        let timedOut = false;
        let intervalID;

        cLog('IntersectionControls scrollTo: ', index, 'at ', originalPosition);

        slideObserver.disconnect();
        setTimeout(()=>{
            cLog('scrollTo timedOut')
            timedOut = true;
        }, 2000);

        window.scrollTo({
            top:originalPosition,
            left: 0,
            behavior: 'smooth'
        });

        function check(){
            cLog("check")
            if (timedOut) {
                eLog('scrollTo timed out');
                clearInterval(intervalID);
                checkSlides()
                return false;
            }
            const distance = Math.abs(window.scrollY - slideTop);
            if (distance < 1){
                cLog('scroll end')
                clearInterval(intervalID);
                slideObserver.observe(swiper.slides[index]);
                return true;
            } else {
                slideTop = swiper.slides[index].getBoundingClientRect().top + window.scrollY - swiper.params.spaceBetween;
                cLog('still scrolling', slideTop, distance)
                return false;
            }
        }

        intervalID = setInterval(check, 200);
    };

    function checkSlides(){
        swiper.slides.forEach(slide => {
            slideObserver.observe(slide);
        });
    }

    function init(){
        if (!swiper.params.intersectionControls.enabled) return false;
        if (swiper.params.intersectionControls.observerOptions.threshold === 'auto'){
            generateThresholds();
        }
        transitionPoint = swiper.params.intersectionControls.transitionPoint;
        if (swiper.params.customThumbs.enabled 
            && swiper.params.customThumbs.invert === true 
            && swiper.params.customThumbs.swiper){
            controlSwiper = swiper.params.customThumbs.swiper;
        } else {
            controlSwiper = swiper;
        }
        slideObserver = new IntersectionObserver(handle, swiper.params.intersectionControls.observerOptions);
        cLog('transitionPoint', swiper.params.intersectionControls.transitionPoint)
        checkSlides();
    }

    function enable(){
        if (swiper.params.intersectionControls.enabled) return false;
        swiper.params.intersectionControls.enabled = true;
        if (swiper.params.customThumbs && swiper.params.customThumbs.enabled === true && swiper.params.customThumbs.invert === true){
            cLog('IntersectionControls enable scrollTo');
            scrollTo(controlSwiper.realIndex);
        };
        checkSlides();
        cLog('intersectionControls: enabled');
        return true;
    };

    function disable(){
        cLog('intersectionControls: disabled');
        if (!swiper.params.intersectionControls.enabled) return false;
        slideObserver.disconnect();
        swiper.params.intersectionControls.enabled = false;
        return true;
    };

    on('thumbClick', (eventSwiper, event) =>{
        cLog('IntersectionControls thumbClick');
        if (!swiper.params.intersectionControls.enabled || !swiper.params.intersectionControls.thumbsScroll) return false;
        cLog('thumbscroll enabled')
        if (swiper.params.customThumbs && swiper.params.customThumbs.enabled === true && swiper.params.customThumbs.invert === true){
            cLog('thumbclick valid',)
            scrollTo(parseInt(event.currentTarget.getAttribute('data-hash')) - 1);
        };
    });

    on('init', () => {
        if (swiper.params.intersectionControls.enabled) {
            cLog('intersectionControls: init');
            enable();
            init();
        };
    });

    on('destroy', () => {
        if (swiper.params.intersectionControls.enabled) {
            disable();
        };
    });

    Object.assign(swiper.intersectionControls, {
        enable,
        disable,
        scrollTo
    });
}



