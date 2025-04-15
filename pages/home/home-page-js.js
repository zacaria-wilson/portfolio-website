"use strict";
(() => {

    function createSwipers(){

        let slideMargin1 = 80;
        let slideMargin2 = 20;

        const mobileBreakpoint = 991;
        const mobileModeClass = 'mobile-mode';
        
        const swiper1Element = document.querySelector('.image-slider')
        const swiper2Element = document.querySelector('.content-slider');
        
        let currentSlideIndex;

        //#region Resize Slides
        function resizeSlides(swiper, options = {}) {
            console.log(swiper.el.classList[0], 'resizeSlides')

            const autoHeightClass = 'auto-height'

            swiper.slides.forEach((slide, index) => {
                //console.log('slide width auto', slide)
                
                if (options.AutoHeight === false) {
                    slide.style.height = options.fixedHeight;
                } else {
                    slide.style.width = "auto";
                    slide.style.height = "auto";
                }
                
            });
        }
        //#endregion

        //#region Resize Wrapper
        function resizeWrapper(swiper) {
            console.log(swiper.el.classList[0], 'resizeWrapper')
            console.log('resizeWrapper', swiper.slides)
            swiper.wrapperEl.style.height = swiper.slides[swiper.realIndex].getBoundingClientRect().height.toString() + 'px';
        }

        //#endregion

        //#region Link Thumbs
        function linkThumbs(swiper){

            swiper.slides.forEach((slide, index) => {

                slide.addEventListener('click', () => {
                    console.log('Thumbnail clicked: ', index);
                    swiper.slideTo(index);
                    //swiper1 !== undefined ? scrollTo(swiper1, index) : console.log('linkThumbs: swiper1 undefined');
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
        function translateWrapper(swiper, options = {slideMargin:0, offsetStart:0}) {
            console.log(swiper.el.classList[0], ' translateWrapper: options', options)

            try {
                let index = swiper.realIndex;
                //console.log('swiper2 realIndex:', index);
                let inactiveSlide = swiper.el.querySelector('.swiper-slide:not(.swiper-slide-active)');
                //console.log('swiper2 inactiveSlide:', inactiveSlide)
                let inactiveSlideH;
                let translate;

                inactiveSlide ? inactiveSlideH = inactiveSlide.getBoundingClientRect().height : console.error('swiper2Translate: no inactiveSlide');

                //console.log('inactiveSlideH:', inactiveSlideH)

                if(inactiveSlideH && index != undefined) {

                    //Calculates verical translate of wrapper element:
                    //Adds slide height and margin to get total translate distance per slide.
                    //Adjusts the indexing to offset which slide the wrapper starts translating at, ensuring index is not less than 0.
                    //Multiplies translate distance by the negative adjusted index to translate in the negative y direction (up).
                    translate = ( inactiveSlideH + options.slideMargin ) * Math.max( 0, (index + options.offsetStart) ) * -1

                } else {
                    console.error('swiper2Translate: no inactiveSlideH or index')
                };

                console.log(swiper.el.classList[0], ' translateWrapper: ', translate.toString(), 'px')
                swiper.wrapperEl.style.translate = '0px ' + translate.toString() + 'px';
            } catch (err) {
                console.error('swiper2Translate error:', err)
            }
            

        }
        //#endregion

        //#region Sync Slide Visibility
        //Toggles visibilty of slides depending on whether they are within a specific range of the active slide.
        function syncSlideVisibilty(swiper){

            let activeIndex = swiper.realIndex;
            
            try {
                swiper.slides.forEach((slide, index) => {
                    console.log('syncSlideVisibilty: activeIndex = ', activeIndex, 'slide index = ', index);

                    //Checks if slide index is outside allowed range of active index
                    //Allowed range is from 1 slide before current to 2 slides after current.
                    if ( index < activeIndex - 1 || index > activeIndex + 2 ){
                        
                        if ( !slide.classList.contains('hidden') ){
                            slide.classList.add('hidden')
                        }
                    //Shows slides inside allowed range
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

            enabled: false,


            //disables default transition tranlate behaviour, allowing for custom transition
            // Also disables the swiper.setTranslate method, so custom transitions must translate the swiper.wrapperEl directly
            virtualTranslate: true,
            
            on: {
                afterInit: function() {
                    console.log('swiper2: on.afterInit');

                    //Needed for both mobile and desktop
                    styleBullets(this);
                    linkThumbs(this);

                },
                
                update: function() {
                    console.log('swiper2 on.update');
                    resizeSlides(this, {AutoHeight: true});
                    syncSlideVisibilty(this);
                    
                },

                slideChange: function(){
                    console.log('swiper2 on.slideChange');
                    translateWrapper(this, {slideMargin: slideMargin2, offsetStart: -1});
                    syncSlideVisibilty(this);
                    styleBullets(this);
                    resizeSlides(this, {AutoHeight: true});
                    
                    if (( this.realIndex + 1 ) === this.slides.length ) {
                        
                    }
                },
            }
            
        });
        //#endregion

        //#region Swiper2Mobile

        const swiper2Mobile = new Swiper('.content-slider', {

            enabled: false,

            slidesPerView: 'auto',

            spaceBetween: 40,

            on:{

                afterInit: function(){
                    console.log('swiper2Mobile: on.afterInit')
                },

                update: function(){
                    console.log('swiper2Mobile: on.update')
                    resizeWrapper(this);
                }
            }

        })

        //#endregion

        //#region Define Swiper1
        const swiper1 = new Swiper('.image-slider', {
            
            resizeObserver: false,

            direction: 'vertical',

            spaceBetween: slideMargin1,
            
            autoHeight: true,

            virtualTranslate: true,

            slidesPerView: 1,

            mousewheel: true,
            
            
            thumbs: {
                swiper: swiper2,
                multipleActiveThumbs: false,
            },
            
            
            //enabled: false,
            

            on: {
                afterInit: function(){
                    console.log('swiper1 on.afterInit');
                    //console.log(this.el.classList[0], ' on.afterInit: this =', this)
                    resizeSlides(this, {AutoHeight: false, fixedHeight:'var(--project-img-height)'});
                    //this.slideTo(0);
                    resizeWrapper(this);
                    //swiper1Observer = new SlideObserver(this);
                },

                slideChange: function(){
                    console.log('swiper1 on.slideChange');
                    console.log('swiper1 ons.slideChange: realIndex = ', this.realIndex)
                    resizeSlides(this, {AutoHeight: false, fixedHeight:'var(--project-img-height)'});
                    swiper2.slideTo(this.realIndex);
                    translateWrapper(this, {slideMargin: slideMargin1, offsetStart:0});
                    
                },

                update : function(){
                    console.log('swiper1 on.update');
                    resizeSlides(this, {AutoHeight: false, fixedHeight:'var(--project-img-height)'});
                },
            }

            
        });
        //#endregion

        //#region ResponsiveInit

        //Syncs current slide when switching between swiper2 mobile and desktop.
        //Updates higher-scoped variable currentSlideIndex to store active slide index, 
        //for use in responsiveResize() calls to swiper.slideTo(currentSlideIndex).
        function responsiveSyncCurrentSlide(targetMode){
            if (targetMode === 'mobile'){
                currentSlideIndex = swiper2.realIndex; 
            } else if (targetMode === 'desktop'){
                currentSlideIndex = swiper2Mobile.realIndex; 
            }
        }

        //Toggles element styles for between mobile and desktop mode.
        //Adds or removes class, depending on passed mode argument.
        //Only checks the swiper2 element, since that is more responsive,
        //but also toggles visibilty for swiper1, since it will not initialize properly if hidden by default.
        function ToggleResponsiveStyles(mode){
            if((mode === 'mobile') && !swiper2Element.classList.contains(mobileModeClass)){
                swiper2Element.classList.add(mobileModeClass)
                swiper1Element.classList.add(mobileModeClass)
            } else if ((mode === 'desktop') && swiper2Element.classList.contains(mobileModeClass)){
                swiper2Element.classList.remove(mobileModeClass)
                swiper1Element.classList.remove(mobileModeClass)
            }
        }

        //Swaps between mobile and desktop modes.
        //Updates mode-specific features of swiper2/swiper2Mobile.
        //Toggles enabled state of swiper instances according to mode.
        function mobileModeToggle(){
            console.log('responsiveResize')
            
            //Checks current window width to determine which mode to swap to
            //Does not need to check if already in that mode, 
            //since this function is only called by the resize listener callback in responsiveInit(),
            //which includes transition checking logic
            if (window.innerWidth <= 991){
                console.log('responsiveResize: mobile')

                ToggleResponsiveStyles('mobile');
                responsiveSyncCurrentSlide('mobile');
                swiper2.disable();
                swiper2Mobile.enable();
                swiper2Mobile.slideTo(currentSlideIndex);
            } else{
                console.log('responsiveResize: desktop')

                ToggleResponsiveStyles('desktop');
                responsiveSyncCurrentSlide('desktop');
                swiper2Mobile.disable();
                swiper2.enable();
                swiper2.slideTo(currentSlideIndex);
            }
            
        }

        function ResponsiveInit(){

            let prevWindowWidth = window.innerWidth;
            let newWindowWidth;

            if (window.innerWidth <= 991){
                console.log('mobile init');

                swiper2Mobile.enable();
                ToggleResponsiveStyles('mobile');
                swiper2Mobile.update();
                

            }else{
                console.log('desktop init');

                swiper2.enable();
                //swiper1.enable();
            }

            //Adds reisize listener for mobile/desktop mode swapping.
            //Checks if the window width crosses the breakpoint on window resize,
            //calls responsiveResize() accordingly.
            window.addEventListener('resize', e => {
                console.log('Responsive Init: resize listener called')

                newWindowWidth = window.innerWidth;

                //Checks if the window width crossed the mobile breakpoint during resize
                //Only calls the responsiveResize() function if breakpoint is crossed.
                //This reduces unecessary responsiveResize() calls when the window width does not cross the breakpoint
                //Also removes the need for toggle checking logic in responsiveResize() and the functions it calls.
                if (prevWindowWidth > mobileBreakpoint && newWindowWidth <= mobileBreakpoint){
                    mobileModeToggle();
                } else if (prevWindowWidth <= mobileBreakpoint && newWindowWidth > mobileBreakpoint){
                    mobileModeToggle();
                }

                //Updates stored value of window width for comparison during future resize events
                prevWindowWidth = newWindowWidth;

            })
            

        }

        ResponsiveInit();

        //#endregion
    };

    window.onloadList.push(createSwipers);

})();
