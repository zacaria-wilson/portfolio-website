"use strict";
(() => {

    function createSwipers(){

        let slideMargin2 = 20;
        
        let swiper1Observer;

        //#region Resize Slides
        function resizeSlides(swiper, options = {}) {
            console.log('swiper resizeSlides')

            let autoHeightClass = 'auto-height'

            swiper.slides.forEach((slide, index) => {
                //console.log('slide width auto', slide)
                if (options.inactiveAutoHeight = true) {
                    if (index != swiper.realIndex){
                        if (!slide.classList.contains(autoHeightClass)) {slide.classList.add(autoHeightClass)}
                    } else {
                        if (slide.classList.contains(autoHeightClass)) {slide.classList.remove(autoHeightClass)}
                    }
                } 
                    slide.style.width = "auto";
                    slide.style.height = "auto";
                
                
            });
        }
        //#endregion

        //#region Link Thumbs
        function linkThumbs(swiper){

            swiper.slides.forEach((slide, index) => {

                slide.addEventListener('click', () => {
                    console.log('Thumbnail clicked: ', index);
                    swiper.slideTo(index);
                    swiper1 !== undefined ? scrollTo(swiper1, index) : console.log('linkThumbs: swiper1 undefined');
                })

            })
        }
        //#endregion

        //#region Style Bullets
        function styleBullets(swiper){
            try {
                swiper.slides.forEach((slide, index) => {
                    const numberEl = slide.querySelector('.project-number');
                    const numberVal = index + 1;
                    
                    if (numberVal < 10){
                        numberEl.textContent = '0' + numberVal.toString() + '.';
                    } else {
                        numberEl.textContent = numberVal.toString() + '.';
                    }

                });
    
            } catch (err) {
                console.error('indexSlides failed:', err);
            }
        }
        //#endregion

        //#region Swiper Translate
        function swiper2Translate(swiper) {
            console.log('swiper2Translate')

            try {
                let index = swiper.realIndex;
                //console.log('swiper2 realIndex:', index);
                let inactiveSlide = swiper.el.querySelector('.swiper-slide:not(.swiper-slide-active)');
                //console.log('swiper2 inactiveSlide:', inactiveSlide)
                let inactiveSlideH;
                let translate;

                inactiveSlide ? inactiveSlideH = inactiveSlide.getBoundingClientRect().height : console.error('swiper2Translate: no inactiveSlide');

                //console.log('inactiveSlideH:', inactiveSlideH)

                inactiveSlideH && index != undefined ? translate = ( inactiveSlideH + slideMargin2 ) * Math.max( 0, (index - 1) ) * -1 : console.error('swiper2Translate: no inactiveSlideH or index');

                console.log('swiper2Translate: translate', translate.toString(), 'px')
                swiper.wrapperEl.style.translate = '0px ' + translate.toString() + 'px';
            } catch (err) {
                console.error('swiper2Translate error:', err)
            }
            

        }
        //#endregion

        //#region Sync Slide Visibility
        function syncSlideVisibilty(swiper){

            let activeIndex = swiper.realIndex;
            
            try {
                swiper.slides.forEach((slide, index) => {
                    //console.log('syncSlideVisibilty: activeIndex = ', activeIndex, 'slide index = ', index);

                    //checks if slide index is within allowed range of active index
                    if ( index < activeIndex - 1 || index > activeIndex + 2 ){
                        slide.classList.add('hidden')
                        
                    } else {
                        if ( slide.classList.contains('hidden') ){
                            slide.classList.remove('hidden')
                        }
                    }
                });

            } catch (err) {
                console.error('syncSlideVisibility error:', err)
            }
        };
        //#endregion

        //#region Scroll To
        function scrollTo(swiper, index){

            console.log('scrollTo from', swiper.el, 'to slide: ', index)
            let targetSlide = swiper.slides[index];
            console.log('scrollTo: targetSlide = ', targetSlide)
            let slideTop;

            function debounce(method, delay) {
                clearTimeout(method.timeout);
                method.timeout = setTimeout(() => {
                    method();
                }, delay)
            }

            function scrollChecker(){ 
                console.log('scrollChecker: window.scrollY = ', window.scrollY, ' slideTop = ', slideTop);
                if (Math.abs(window.scrollY - slideTop) < 1){
                    console.log('scrollChecker: scroll end')
                    window.removeEventListener('scroll', scrollHandler);
                    swiper1Observer.slideObserver.observe(targetSlide);    
                }
                
            }

            function scrollHandler(event){
                debounce(scrollChecker, 100)
            }
            
            try{
                console.log('ScrollTo: swiper1Observer.slideObserver = ', swiper1Observer.slideObserver);
                swiper1Observer.slideObserver.disconnect();
                slideTop = targetSlide.getBoundingClientRect().top + window.scrollY - 80;
                console.log('scrollTo: slideTop =', slideTop)
                window.scrollTo({
                    top: slideTop,
                    left: 0,
                    behavior: 'smooth',
                })

                scrollHandler();

                window.addEventListener('scroll', scrollHandler, {
                })
                
                

            } catch (err) {
                console.error('scrollTo error', err)
            }
        };
        //#endregion

        //#region Slide Observer
        class SlideObserver {

            constructor(swiper){

                this.swiper = swiper;

                this.thresholds = [0];

                this.observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: this.thresholds,
                };

                this.slideObserver;

                this.init();

            }
            //#region Init Observer
            async init(){
            
                try {
                    await this.generateThresholds();
                    //await console.log('observerOptions.thresholds = ', this.observerOptions.threshold);
                    await this.createObserver();
                    //await console.log('this.slideObserver.thresholds = ', this.slideObserver.thresholds)
                    await this.observeSlides();
                } catch (err) {
                    console.error('initObservers error:', err)
                }
    
            }
            //#endregion

            //#region Generate Thresholds
            async generateThresholds(){

                let promiseArray = [];
    
                for (let i = 0.01; i < 1; i+= 0.01){
                    promiseArray.push(new Promise((resolve, reject) => {
                        try{
                            this.thresholds.push(Number.parseFloat(i.toFixed(2)));
                            resolve();
                        } catch (err) {
                            console.error('generateThresholds error:' + err);
                            reject()
                        }   
                    }))
                    
                };
    
                await Promise.all(promiseArray);
                
            }

            //#region Create Observer
            async createObserver() { 

                const targetScrollPosition = window.innerHeight * 0.7;

                //console.log('createObserver: this.observerOptions.thresholds', this.observerOptions.threshold)
    
                this.slideObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach((target) => {

                        let index = target.target.getAttribute('data-hash') - 1 ;

                        //console.log('slidesObserver target:', index)
                        //console.log('slidesObserver target.intersectionRatio = ', target.intersectionRatio)
                        //console.log('slideObserver.observer.thresholds', observer.thresholds)
                        //this.check('this.observerOptions.threshold', this.observerOptions.threshold)
    
                        if (target.isIntersecting){
                            //console.log('Observer: target is intersecting', index)
                            if(target.boundingClientRect.bottom > targetScrollPosition && target.boundingClientRect.top <= targetScrollPosition){
                                //console.log('Observer: target within area: ', index)
                                
                                if(index != this.swiper.realIndex){
                                    console.log('Observer: Setting active slide to:', index)
                                    this.swiper.slideTo(index);
                                } else {
                                    //console.log('slidesObserver: target index ', index, '= swiper.realIndex')
                                    //this.check('Observer: Active slide:', t, target.target, 'intersection ratio is:', target.intersectionRatio) 
                                }
                            }else {
                                console.log('slideObserver: Current slide reached bound condition: ', index);
                                if (target.boundingClientRect.top > targetScrollPosition) {
                                    //console.log('Top Observer Callback: Slide:', index)
                                    //this.check('top is at:', target.boundingClientRect.top, ' top observer slideTo: ', (t - 1));
                                    this.swiper.slideTo(index - 1);
                                    this.slideObserver.unobserve(target.target);
                                    this.slideObserver.observe(this.swiper.slides[index - 1])
                                    
                                };
                                //Transition to next slide if bottom of slide is above the transition point, unless the target is the last slide.
                                if ((target.boundingClientRect.bottom < targetScrollPosition) && (index < (this.swiper.slides.length - 1 ))) {
                                    //console.log('Bottom Observer Callback: Slide:', index)
                                    //this.check('bottom is at:', target.boundingClientRect.bottom, 'bottom observer slideTo: ', (t + 1));
                                    this.swiper.slideTo(index + 1);
                                    this.slideObserver.unobserve(target.target);
                                    this.slideObserver.observe(this.swiper.slides[index + 1])
                                    
                                };
    
                            };
                        } else {
                            console.log('slideObserver: unobserving slide: ', index)
                            observer.unobserve(target.target)
                        }
                    });
    
                }, this.observerOptions); 
    
            };
            //#endregion

            //#region Observe Slides
            async observeSlides(){
                this.swiper.slides.forEach((slide, index) => {
                    this.slideObserver.observe(slide)
                })
            }
            //#endregion
        };
        //#endregion
        
        //#region Define Swiper2
        const swiper2 = new Swiper('.content-slider', {

            //may need to set false if nav elements are outside slider container, which they will likely be.
            //uniqueNavElements: false,

            //prevents swiper from automatically setting all slide widths equal, preventing closed slides from shrinking
            resizeObserver: false,

            direction: 'vertical',

            spaceBetween: slideMargin2,
            
            autoHeight: true,

            allowTouchMove: false,

            //disables default transition tranlate behaviour, allowing for custom transition
            // Also disables the swiper.setTranslate method, so custom transitions must translate the swiper.wrapperEl directly
            virtualTranslate: true,
            
            on: {
                afterInit: function() {
                    console.log('swiper2: on.afterInit');

                    resizeSlides(this, {inactiveAutoHeight: true});
                    styleBullets(this);
                    linkThumbs(this);
                    syncSlideVisibilty(this);

                    /*
                    this.slides.forEach((slide, index) => {
                        console.log('swiper2 slide ', index, ' getBoundingClientRect().top = ', slide.getBoundingClientRect().top)
                    })
                    */

                },
                
                update: function() {
                    console.log('swiper2 on.update');
                    resizeSlides(this, {inactiveAutoHeight: true});
                    
                },

                slideChange: function(){
                    console.log('swiper2 on.slideChange');
                    swiper2Translate(this);
                    syncSlideVisibilty(this);
                    linkThumbs(this);
                    styleBullets(this);
                    resizeSlides(this, {inactiveAutoHeight: true});
                    //console.log('swiper2 on.slideChange: realIndex = ', this.realIndex, 'slides.length = ', this.slides.length)
                    //code to run on last slide

                    

                    if (( this.realIndex + 1 ) === this.slides.length ) {
                        
                    }
                    //console.log('swiper2 getTranslate:', this.getTranslate());
                },
            }
            
        });
        //#endregion

        //#region Define Swiper1
        const swiper1 = new Swiper('.image-slider', {
            
            //sets direction of swiper to vertical, since slides are arranged vertically
            direction: 'vertical',

            //may need if freeMode does not allow continous scrolling on mobile.
            //followFinger: true,

            //allows continous scrolling between slides without snapping.
            freeMode: true,

            //use for featured links from homepage. May need to add functionality to listen for window.beforeunload event and redirect to a url without a hash or with current slide has, depending on desired reload experience. 
            //hashNavigation: { replaceState: true },

            //may need to set height, depending on how wrapper sizing/ flex layout works.
            //height: swiper1Height,

            //needed to adjust wrapper element to slide size
            //autoHeight: true,

            //resizeObserver: false,

            //cssMode: true,

            //hashNavigation: true,

            virtualTranslate: true,

            //enables scrolling navigation
            mousewheel: false,
            
            //probably need for handling changes to swiper/slide size from things like window resize or switching between desktop/mobile images.
            resizeObserver: false,

            //setting to auto should show all slides at once.
            slidesPerView: 1,
            
            //may be useful for implementing custom transition points, rather than using IntersectionObserver
            //watchSlidesProgress: true,
            

            //adds a margin to adjust slide transition point

            /*
            thumbs: {
                swiper: swiper2,
                multipleActiveThumbs: false,
            },
            */
            
            on: {
                afterInit: function(){
                    console.log('swiper1 on.afterInit');
                    resizeSlides(this);
                    swiper1Observer = new SlideObserver(this);
                },

                slideChange: function(){
                    console.log('swiper1 on.slideChange');
                    console.log('swiper1 ons.slideChange: realIndex = ', this.realIndex)
                    swiper2.slideTo(this.realIndex);
                    
                },

                resize: function(){
                    console.log('swiper1 on.resize');
                    resizeSlides(this);
                }
            

            }

            
        });
        //#endregion
    };
    

    //#region Onload Function
    //Adds function to global onload execution in site-header-js.js
    window.onloadList.push(() => {
        
        //Scroll to top of page before loading swipers. Ensures initial state is at the first slide, preventing sync errors on initialization.
        setTimeout(() => {

            window.scrollTo({
                top:0,
                left:0,
                behavior: 'instant',
            })
            
            createSwipers();

        }, 100)
        
    });
    //#endregion
    
})();

