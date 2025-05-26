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
                threshold: 'auto'
            }
        },

    });

    swiper.intersectionControls = {
        enabled: false,
    };
    let initialized = false;
    let slideObserver;
    let transitionPoint;
    let controlSwiper;
    let prevScrollTo;
    let scrollQueued = false;
    let isScrolling = false;
    let prevResize;
    let isResizing = false;

    function generateThresholds(){
        let thresholds = [];
        for(let i = 0.01; i <= 1; i += 0.01){
            thresholds.push(Number.parseFloat(i.toFixed(2)));
        }
        swiper.params.intersectionControls.observerOptions.threshold = thresholds;
    }

    const handle = (entries, observer) => {
        for (const entry of entries){
            if(!swiper.intersectionControls.enabled) return; 
            const target = entry.target;
            if (!entry.isIntersecting){
                observer.unobserve(target);
            } else {
                const index = swiper.slides.indexOf(target);
                const top = entry.boundingClientRect.top;
                const bottom = entry.boundingClientRect.bottom + swiper.params.spaceBetween;
                
                if (top <= transitionPoint && bottom > transitionPoint){
                    if (index != controlSwiper.realIndex){
                        if (!isScrolling){
                            scrollTo(controlSwiper.realIndex);
                        }
                        return;
                    }
                }
                if (top > transitionPoint){
                    observer.unobserve(target);
                    controlSwiper.slideTo(index - 1);
                    observer.observe(swiper.slides[index - 1]);
                    return;
                }
                if (bottom < transitionPoint && index < (swiper.slides.length - 1)){
                    observer.unobserve(target);
                    controlSwiper.slideTo(index + 1);
                    observer.observe(swiper.slides[index + 1]);
                    return;
                }
            }
            
        }
    };

    async function scrollTo(index){
        if (typeof index !== 'number') return false;
        const originalPosition = swiper.slides[index].getBoundingClientRect().top + window.scrollY - swiper.params.spaceBetween;
        let slideTop = 0;
        let timedOut = false;
        let intervalID;

        slideObserver.disconnect();

        function checkScrolled(){
            if (timedOut) {
                isScrolling = false;
                clearInterval(intervalID);
                checkSlides();
                return false;
            }
            const distance = Math.abs(window.scrollY - slideTop);
            if (distance < 1){
                isScrolling = false;
                clearInterval(intervalID);
                slideObserver.observe(swiper.slides[index]);
                return true;
            } else {
                slideTop = swiper.slides[index].getBoundingClientRect().top + window.scrollY - swiper.params.spaceBetween;
                return false;
            }
        }

        if (isResizing){
            queueScroll(index)
        } else {
            isScrolling = true;
            setTimeout(()=>{
                timedOut = true;
            }, 2000);

            window.scrollTo({
                top:originalPosition,
                left: 0,
                behavior: 'smooth'
            });

            intervalID = setInterval(checkScrolled, 200);
        }
        
    };

    function queueScroll(index){
        prevScrollTo = index;
        if (scrollQueued) return false;
        scrollQueued = true;
        
        let intervalID;
        let timedOut = false;

        setTimeout(()=> {
            timedOut = true
        }, 5000)

        function canScroll(){
            if (timedOut) {
                clearInterval(intervalID);
                scrollQueued = false;
                checkSlides()
                return false;
            }
            if (!isResizing){
                clearInterval(intervalID);
                scrollQueued = false;
                scrollTo(prevScrollTo);
                return true;
            }
            return false;
        }
        intervalID = setInterval(canScroll, 200);
    }

    function resize(){
        prevResize = now();
        if (isResizing) return false;
        isResizing = true;

        let intervalID;
        let timedOut = false;
        
        setTimeout(()=> {
            timedOut = true
        }, 5000)

        function checkResized(){
            if (timedOut){
                clearInterval(intervalID);
                isResizing = false;
                checkSlides();
                return false
            }
            if ((now() - prevResize) > 500){
                isResizing = false;
                clearInterval(intervalID)
                checkSlides();
                return true;
            }
            return false;
        }
        intervalID = setInterval(checkResized, 200);
    }



    function checkSlides(){
        if(!swiper.intersectionControls.enabled) return false;
        swiper.slides.forEach(slide => {
            slideObserver.observe(slide);
        });
    }

    function init(){
        if (initialized) return false;
        if (swiper.params.intersectionControls.observerOptions.threshold === 'auto'){
            generateThresholds();
        }
        if (typeof swiper.params.intersectionControls.transitionPoint !== 'number') return false;
        transitionPoint = swiper.params.intersectionControls.transitionPoint;
        if (swiper.params.customThumbs 
        && swiper.params.customThumbs.enabled
        && swiper.params.customThumbs.invert === true 
        && swiper.params.customThumbs.swiper){
            controlSwiper = swiper.params.customThumbs.swiper;
        } else {
            controlSwiper = swiper;
        }
        slideObserver = new IntersectionObserver(handle, swiper.params.intersectionControls.observerOptions);
        initialized = true;
        return true;
    }

    function enable(){
        if (swiper.intersectionControls.enabled) return false;
        swiper.intersectionControls.enabled = true;
        resize();
        return true;
    };

    function disable(){
        if (!swiper.intersectionControls.enabled) return false;
        slideObserver.disconnect();
        swiper.intersectionControls.enabled = false;
        return true;
    };

    on('thumbClick', (eventSwiper, event)=> {
        if (!swiper.intersectionControls.enabled || !swiper.params.intersectionControls.thumbsScroll) return false;
        if (swiper.params.customThumbs && swiper.customThumbs.enabled && swiper.params.customThumbs.invert){
            scrollTo(parseInt(event.currentTarget.getAttribute('data-hash')));
        };
    });

    on('resize', (...args)=> {
        if (!swiper.intersectionControls.enabled) return false;
        resize()

    })

    on('init', ()=> {
        if (swiper.params.intersectionControls.enabled) {
            if(!init()) return false;
            enable();
        };
    });

    on('destroy', ()=> {
        if (swiper.intersectionControls.enabled) {
            disable();
        };
    });

    Object.assign(swiper.intersectionControls, {
        enable,
        disable,
        scrollTo
    });
}



