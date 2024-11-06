"use strict";
(() => {
    function contstructSliderClass() {
    
        //Helper Function: Error Logging
        function eLog(...logInput) { 
            console.error(...logInput)
        }

        async function check(...logInput) { 
            console.log(...logInput)
        }

        //Slider Class
        class Slider {

            //#region Constructor
            constructor(containerID, passedOptions = {}) {
                
                //allows external reference to slider object
                this.slider = this;
                //useful for logging tests to know which slider is doing what.
                this.name = containerID
                
                //Gets container element
                this.container = document.getElementById(containerID);
                
                // helper function for getting the elements. Arg 1: selected element class. Arg 2: binary for choosing querSelector or querySelctorAll. Arg 3: querried object (e.g. slider container, document)
                this.queryFunction = (selector, all = false, container = undefined) => {
                    let queryObj;
                    container ? queryObj = container : (this && this.container) ? queryObj = this.container : eLog('invalid query object');
                    return all ? queryObj.querySelectorAll(selector) : queryObj.querySelector(selector);
                };

                //Default options configuration for Slider objects. Also contains the accepted data type for each option, to be checked against any passed options and prevent errors.
                this.options = {
                    wrapperClass: { val: '.slider-wrapper', acceptedTypes: ['string'] },
                    slidesClass: { val: '.slider-slide', acceptedTypes: ['string'] },
                    activeSlidesClass: { val: 'active-slide', acceptedTypes: ['string'] },
                    slideIndexAttribute: { val: 'slide-index', acceptedTypes: ['string'] },
                    slideHeight: { val: 'auto', acceptedTypes: ['string'] }, // Default slide height
                    nextEl: { val: '.slider-next', acceptedTypes: ['string'] }, // Default next arrow selector
                    prevEl: { val: '.slider-prev', acceptedTypes: ['string'] }, // Default prev arrow selector
                    bulletsClass: { val: '.slider-pagination-bullet', acceptedTypes: ['string'] },
                    activeBulletClass: { val: 'active-bullet', acceptedTypes: ['string'] },
                    bulletIndexAttribute: { val: 'bullet-index', acceptedTypes: ['string'] },
                    unfoldButtons: { val: '.unfold-arrow', acceptedTypes: ['string'] },
                    unfoldIndexAttribute: { val: 'unfold-index', acceptedTypes: ['string'] },
                    slideTextClass: { val: '.project-desc', acceptedTypes: ['string'] },
                    slideTextWrapClass: { val: '.project-desc-container', acceptedTypes: ['string'] },
                    bulletedTextWraps: { val: '.project-process-wrap', acceptedTypes: ['string'] },
                    responsiveButtonClass: { val: '.responsive-display-icon', acceptedTypes: ['string'] },
                    transitionPoint: { val: window.innerHeight * 0.7, acceptedTypes: ['number'] },
                    verticalBreakpoint: { val: 1280, acceptedTypes: ['number'] },
                    mobileBreakpoint: { val: 990, acceptedTypes: ['number'] },
                    slideMode: { val: 'scroll', acceptedTypes: ['string'] },
                    linkedSlider: {val: undefined, acceptedTypes:['object']}



                };
                
                //Makes passed options accessible for all Slider methods. Needed for option configuration.
                this.passedOptions = passedOptions;

                
                //options object for intersection observers.
                this.observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    //Threshold set to 0 initially. Intersection ratios are dynamically generated later based on slide heights.  
                    threshold: [0],
                };
                
                this.ready = false;
                
                //Calls the function to initialize the Slider object.
                this.init();

            };

            //#endregion

            //#region Initialization

            //Initialization function
            async init() {
                //Verifies options configuration is valid and initializes slider functions
                if (this.optionsTypeChecker(this.options)) {
                    try {
                        //Sets class scoped elements based on options (default and passed). Needed for all global references.
                        await this.initClassVars(this.options,this.queryFunction);
                        //Disables methods based on options configuration. This must be executed before slider functions that vary based on configured options.
                        await this.optionsConfig();
                        //Indexes slides and bullets. 
                        /*TODO: Currently the logic on determining which type of indexable elements are available in the particular Slider instance is defined either within the function or within the options config.
                        It should all be determined in the options config, for consistency.
                        */
                        await this.removeEmptyText();
                        await this.elementCounter(this.slides);
                        await this.elementCounter(this.bullets);
                        await this.elementCounter(this.unfoldButtons);
                        
                        //Adds navigation function to bullets elements
                        await this.initBullets();

                        //Adds navigation fuction to arrow elements
                        await this.initArrows();

                        //Adds unfold function to desc unfold buttons
                        await this.initUnfoldButtons();
                        
                        //
                        await this.sliderLink();

                        //Adds change view mode function to responsive view butttons
                        await this.responsiveButtonInit();

                        //Defines observer object and callbacks
                        await this.initializeObservers();
                        
                        //
                        await this.responsiveInit();

                        await this.observerOptionsCalculator();

                        await this.observerReset();
                        

                    } catch (error) {
                        console.error(this.name,'An error occurred during slider initialization:', error);
                    }
                
                    

                } else {
                    eLog("Slider initialization aborted due to invalid options.");
                }
            };

            //#endregion

            //#region Options Config
            //Options Configuration Validation
            async optionsTypeChecker(o) {
                for (let key in this.passedOptions) {
                    o[key].val = this.passedOptions[key];
                    if (o[key].val && o[key].acceptedTypes && (!o[key].acceptedTypes.includes(typeof o[key].val))) {
                        eLog(`${o[key]}`, 'receive invalid input type: ', `${(typeof o[key].val)}`, '. Accepted input types are: ', `${o[key].acceptedTypes}`);
                        return false;
                    }
                    
                }; return true;
            };

            //Helper function for querying
            
            
            //Creates class scoped variables based on slider options.
            async initClassVars(o,$) {
                let t = this;
                t.wrapperEl = $(o.wrapperClass.val);
                t.targetScrollPosition = o.transitionPoint.val;
                t.slides = $(o.slidesClass.val, true);
                t.slideIndexAttribute = o.slideIndexAttribute.val;
                t.activeSlide = undefined;
                t.activeSlideClass = o.activeSlidesClass.val;
                t.slideHeightVal = o.slideHeight.val
                t.bullets = $(o.bulletsClass.val, true);
                t.activeBulletClass = o.activeBulletClass.val;
                t.bulletIndexAttribute = o.bulletIndexAttribute.val;
                t.syncedElements = {slides: {list: this.slides, activeClass: this.activeSlideClass}, bullets: {list: this.bullets, activeClass: this.activeBulletClass}};
                t.prevArrow = $(o.prevEl.val);
                t.nextArrow = $(o.nextEl.val);
                t.unfoldButtons = $(o.unfoldButtons.val, true);
                t.unfoldIndexAttribute = o.unfoldIndexAttribute.val;
                t.slideText = $(o.slideTextClass.val, true);
                t.slideTextWraps = $(o.slideTextWrapClass.val, true);
                t.textBulletWraps = $(o.bulletedTextWraps.val,true);
                t.responsiveButtons = $(o.responsiveButtonClass.val, true, document);
                t.mobileMode = false;
                t.verticalLayout = false;
                t.verticalBreakpoint = o.verticalBreakpoint.val
                t.mobileBreakpoint = o.mobileBreakpoint.val;
                t.sliderMode = o.slideMode.val;
                t.linkedSlider = o.linkedSlider.val;
                t.windowW = window.innerWidth;
            };

            //Checks the slider mode (slide or scroll) of the Slider instance and disables unused class methods.
            //Needed to execute class methods without unused elements/functions causing undefined errors.
            async optionsConfig() {
                let sM = this.sliderMode;
                let sH = this.slideHeightVal;

                let returnFunction = function(){ return; };

                let disable = (...disableList) => {
                    disableList.forEach(method => { 
                        //check(this.name,'Options Config disabled:', method);
                        this[method] = returnFunction;
                    })
                }

                //Defines function that will be run if sliderMode option is set to 'slide'. Function disables methods that are only used for scroll sliders.
                let sliderModeSlide = () => {
                    disable(
                        //Disables calls to reset the observer to the current slide. Note: disabling this and the observer methods (below) may be reduntant.
                        'observerReset',
                        'initializeObservers', 
                        'responsiveButtonInit',
                        'modeSwap',
                        'observerOptionsCalculator'
                    );
                    //Disables observer 'disconnect' and 'observe' methods. Note: see above note on redundancy with disabling 'observerReset'.
                    this.currentObserver = {disconnect: returnFunction, observe: returnFunction, unobserve: returnFunction}
                    //Replaces the scrollTo function with the slideTo function. Allows functions to call scrollTo for both 'scroll' and 'slide' sliders, without include conditional logic for slide mode.
                    this.scrollTo = (t) => {this.slideTo(t);}
                };

                //Defines function to be run when slideMode is 'scroll'. Currently no methods are exclusive to slide behaviour. Note: sidebar methods are disabled/enabled by a later check for sidebar elements.
                let sliderModeScroll = () => {

                };

                //Defines function to be run when slideHeight is 'auto'. Currently no need to disable methods.
                let slideHeightAuto = returnFunction;

                //Defines function to be run when slideHeight is 'css'.
                let slideHeightCSS = () => {
                    //Disables adjusting wrapper height to current slide. Used when slides CSS position is relative, since wrapper is auto sized. 
                    disable('wrapperUpdateHeight','stickyHeight');
                };

                //Defines object that matches slideHeight option to corresponding config function.
                let slideHeightOptions = {
                    'auto': slideHeightAuto,
                    'css': slideHeightCSS,
                };
                
                //Defines object that matches slideMode option to corresponding config function.
                let sliderModeOptions = {
                    'slide': sliderModeSlide,
                    'scroll': sliderModeScroll
                };


                //Conditional check of slideMode to run corresponding config function.
                if (sM && sliderModeOptions[sM]) {sliderModeOptions[sM]()}
                else {eLog('Invalid slider mode config');}

                //Conditional check of slideHeight to run corresponding config function.
                if (sH && slideHeightOptions[sH]) {slideHeightOptions[sH]()}
                else {eLog('Invalid slide height config');}
                
                //Conditional check of bullets elements to run corresponding config function.
                if (this.bullets.length < 1) {
                    //Disables bullets init function.
                    disable('initBullets')
                    //Updates syncedElements object to remove bullets. syncedElements is referenced to define which elements get positional class updates as slider progresses.
                    delete this.syncedElements.bullets;
                };

                //Conditional check of nav arrow elements to run corresponding config function.
                if (!(this.prevArrow && this.nextArrow)) {
                    disable(
                        //Disables arrows init function.
                        'initArrows'
                    );
                };

                //Conditional check of unfold buttons to run corresponding config function.
                if (this.unfoldButtons.length < 1) {
                    disable(
                        //Disables unfold button init function.
                        'initUnfoldButtons',
                        //Disables functions to show/hide descriptions
                        'textHide',
                        'textShow',
                        //Disables function to toggle unfold state.
                        'updateUnfold'
                    );
                };

                if (this.textBulletWraps.length < 1) {
                    disable(
                        'removeEmptyText'
                    );
                    //check(this.name,'disabled removeEmptyText')
                };
                    
            };

            

            //#endregion

            //#region Startup Functions

            //Gives each element in a nodelist an indexing attribute. Needed for slide naviation.
            async elementCounter(l) {
                for (let i = 0; i < l.length; i++) { 
                    this.slides && l === this.slides ? l.item(i).setAttribute(this.slideIndexAttribute, i)
                        
                    : this.bullets && l === this.bullets ? l.item(i).setAttribute(this.bulletIndexAttribute, i)
                    
                    : this.unfoldButtons && l === this.unfoldButtons ? l.item(i).setAttribute(this.unfoldIndexAttribute, i)
                    
                    : eLog('could not count: ', l);
                }
            };

            //Hide Empty Bullets Project Desc
            async removeEmptyText(){
                //check('textBulletWraps is', this.textBulletWraps)
                this.textBulletWraps.forEach(el=>{
                    //check(this.name,'textBulletWraps el is', el)
                    let bulletText = el.querySelector('.project-desc');
                    if (bulletText.innerHTML.length < 1){
                        el.style.display = "none";
                        //check(this.name,'removed empty bullet', el)
                    }
                })
            }

            async stickyHeight(){
                let headingWrapperHeight = document.querySelector('.page-header-container').getBoundingClientRect().height;
                //this.container.style.top = `calc(-${headingWrapperHeight}px - 6em)`;
                
            };

            //Calcualtes observer intersection ratios based on slide height and target transition position, then pushes them to observer.options.threshold.
            async observerOptionsCalculator(){
                let windowH = window.innerHeight;
                //let windowW = window.innerWidth;
                //let windowA = windowW * windowH;
                ///check('target scroll position is', this.targetScrollPosition)
                let remainderH = windowH - this.targetScrollPosition
                //check('remainderH', remainderH)
                //let mainA = windowW * this.targetScrollPosition;
                //check('mainA', mainA)
                //let remainderA = windowW * remainderH;
                //check('remainderA', remainderA)
                let slideMin = {slide:undefined, height: Infinity, width: 0, area: 0}
                let slideMax = {slide:undefined, height: 0, width: 0, area: 0}
                this.observerOptions.threshold = [0]
                

                //check(this.name, 'Calculating thresholds...')
                this.slides.forEach(el=>{
                    let h = el.getBoundingClientRect().height
                    let w = el.getBoundingClientRect().width
                    let a;
                
                    if (slideMin.height > h){
                        slideMin.slide = el
                        slideMin.height = h
                        slideMin.width = w
                        slideMin.area = w * h

                        //check('h is:', h, 'el is:', el)
                        //check('slideMin.height: ', slideMin.height)
                    }
                    if (slideMax.height < h){
                        slideMax.slide = el
                        slideMax.height = h
                        slideMax.width = w
                        slideMax.area = w * h
                        //check('h is:', h, 'el is:', el)
                        //check('slideMax.height: ', slideMax.height)
                    }
                })

                //check('Largest slide is', slideMax.slide, 'height', slideMax.height, 'and smalles slide is', slideMin.slide, 'height', slideMin.height)

                let minRatioAbove = Math.round((this.targetScrollPosition / slideMin.height ) * 100)
                let maxRatioAbove = Math.round((this.targetScrollPosition / slideMax.height) * 100)
                
                let minRatioBelow = Math.round((remainderH / slideMin.height) * 100)
                let maxRatioBelow = Math.round((remainderH / slideMax.height) * 100)

                check( 'maxRatioAbove:', maxRatioAbove/100 , ' minRatioAbove:', minRatioAbove/100, ' maxRatioBelow:', maxRatioBelow/100, ' minRatioBelow:', minRatioBelow/100)

                for(let i = 0; i < (minRatioBelow + 5) && i <= 100; i++){
                    if (i > 0) {this.observerOptions.threshold.push(i /100)}
                }
                for(let i = (maxRatioAbove - 5); i < (minRatioAbove + 5) && i <= 100; i++){
                    if (i > 0) {this.observerOptions.threshold.push(i /100)}
                }

                
                
                //check(this.name, 'observerOptions.threshold is', this.observerOptions.threshold);
                //check('Observer root element is:', this.observerOptions.root)

            }
            //#endregion

            //#region Responsive Functions
            //Used as a callback for the resize event listener to create responsive functionality.
            async windowResize(){
                //gets window width
                this.windowW = window.innerWidth;

                //Defines breakpoint at which unfold buttons are enabled/disabled.
                
                if(this.windowW >= this.verticalBreakpoint){
                    try{
                        //Un-folds folded descriptions.
                        this.verticalLayout = false;
                        await this.updateUnfold('remove', this.textShow())
                        await this.observerOptionsCalculator();
                        await this.observerReset();
                        await this.wrapperUpdateHeight();
                    } catch (error) {
                        console.error(this.name, `An error occurred during windowResize, where windowW >= ${this.verticalBreakpoint}`, error);
                    }
                    //Un-folds folded descriptions.
                    this.updateUnfold('remove', this.textShow())
                    this.observerReset();
                    this.wrapperUpdateHeight();
                } else {
                    try{
                        //Un-folds folded descriptions.
                        this.verticalLayout = true;
                        await this.updateUnfold('add', this.textHide())
                        await this.observerOptionsCalculator();
                        await this.observerReset();
                        await this.wrapperUpdateHeight();
                    } catch (error) {
                        console.error(this.name, `An error occurred during windowResize, where windowW < ${this.verticalBreakpoint} `, error);
                    }
                }
                
                try{
                //Recalculates intersection ratios due to resized slides/window
                await this.observerOptionsCalculator();
                //Restarts observers/resets slider to current position.
                await this.observerReset();
                //Adjusts sticky height for sidebar slider
                await this.stickyHeight();
                } catch (error) {
                    console.error('An error occurred during windowResize:', error)
                }
                
                
            }

            async modeSwap(urlAttr){
                check('modeSwap...')
                try {
                    await this.slides.forEach((el) => {
                        let img = el.querySelector('.project-image');
                        img.style.opacity = '0'
                        img.setAttribute('src', img.getAttribute(urlAttr))
                        setTimeout(()=>{
                            img.style.transition = 'opacity .5s ease-in-out'
                            img.style.opacity = '1'
                        }, 10)
                        setTimeout(()=>{
                            img.style.transition = 'none'
                        }, 500)
                        
                        
                    });
                } catch (error) {
                    console.error(this.name, 'An error occurred during modeSwap to:', urlAttr, error);
                }
                
            };

            async responsiveChange(v) {
                if (this.mobileMode === false && v){
                    check('Responsive Change to mobile view')
                    try{
                        this.mobileMode = true;
                        await this.modeSwap('mobile-img-url');
                    } catch (error) {
                        console.error(this.name, 'An error occurred during ResponsiveChange to mobile mode', error);
                    }
                    
                    
                } else if (this.mobileMode === true && !v){
                    check('Responsive Change to desktop view')
                    try{
                        this.mobileMode = false;
                        await this.modeSwap('desktop-img-url');
                    } catch (error) {
                        console.error(this.name, 'An error occurred during ResponsiveChange to desktop mode', error);
                    }
                    
                } else {
                    check('Responsive Change: No change')
                }

            };

            //Adds event listener for window resize. Ensures slider functions that are affected by window size are updated on window resize.
            async responsiveInit(){

                window.addEventListener('resize',(e) => {
                    this.windowResize(); 
                })

                if (this.windowW < this.verticalBreakpoint){
                    check('Responsive Init Check: window width is', this.windowW);
                    this.verticalLayout = true
                    this.updateUnfold('add', this.textHide())
                    if (this.windowW <= this.mobileBreakpoint){
                        check('Responsive Init: Responsive Change to Mobile')
                        this.responsiveChange(true);
                    }

                } else {this.responsiveChange(false)}



                //Initial call to update sticky height to correct value. Later calls will be made by this.windowResize.
                this.stickyHeight();

            }

            

            //#endregion
            
            
            //#region Slider Functions

            //Removes positional classes from slides and/or bullets. 
            async removeClasses() {
                let sE = this.syncedElements;
                for (let key in sE){
                    //check(this.name, 'syncedElements key is', key, 'and list is', this.syncedElements[key].list)
                    sE[key].list.forEach(el=>{el.classList.remove(sE[key].activeClass)})
                };
            };

            //Adds positional classes from slides and/or bullets. 
            async addClasses() {
                let sE = this.syncedElements;
                for (let key in sE){
                    sE[key].list.item(this.activeSlide.getAttribute(this.slideIndexAttribute)).classList.add(sE[key].activeClass)
                };
            };
            
            async assignPositions(t) {
                //check(this.name, 'Updating Current Slide to', t)
                this.activeSlide = this.slides.item(t)
            }

            //Core Function: Syncronizes the active position of the slider when active slide is updated. 
            //Updates positional varibles and corresponding classes, controls Intersection Obserever targeting, syncs bullets. 
            async updateSlider(t) {
                if (this.slides.item(t)) {
                    try {
                        check(this.name, 'updateSlider:', t)
                        await this.currentObserver.disconnect();
                        await this.assignPositions(t);
                        await this.removeClasses();
                        await this.addClasses(); 
                        await this.wrapperUpdateHeight()
                        await this.currentObserver.observe(this.slides.item(t)); 
                    } catch (error) {
                        console.error('An error occurred during updateSlider:', error);
                    }
                }

            };
            
            async slideTo(t) {
                if (this.slides.item(t)) {
                    try {
                        //check(this.name, 'slideTo:', t)
                        await this.updateSlider(t)
                        await this.sliderSync(t)
                    } catch (error) {
                        console.error('An error occurred during slideTo:', error);
                    }
                }
            };

            

            scrollTo = async (t, scrollBehavior = 'smooth') => {
                let target = this.slides.item(t)
                if(target) {
                    let scrollTop = target.scrollTop
                    let calcScrollPoint = (t) => {
                        let offestH = this.linkedSlider.container.getBoundingClientRect().height
                        //check('caclScrollPoint offsetH is', offestH) 
                        let slideY = target.offsetTop
                        //check('caclScrollPoint slideY is', slideY, 'slide is', t)
                        let paddingHString = window.getComputedStyle(document.querySelector('.projects-section')).paddingTop;
                        //check('caclScrollPoint paddingHString is', paddingHString)
                        let paddingH;
                        if (t == 0){paddingH = 0} else {paddingH = parseFloat(paddingHString) * 2}
                        
                        //check('caclScrollPoint paddingH is', paddingH)


                        if(this.verticalLayout === true){
                            check('calcScrollPoint for vertical')
                            return Math.round(slideY + paddingH);
                        } else {
                            check('calcScrollPoint for horizontal')
                            return Math.round(slideY);
                        }
                        
                    };

                    let targetScroll = calcScrollPoint(t);
                    //check(this.name, 'scrolling to slide: ', target,' at y: ', targetScroll);
                    let interval = null;

                    let scrollCallback = async () => {
                        if(!interval){
                            interval = setInterval(async () => {
                                //check('Scrolling Interval: scrolling to', window.scrollY, '...')
                                if (window.scrollY === targetScroll){
                                    try{
                                    //check('Scroll target reached')
                                    await this.slideTo(t)
                                    await clearInterval(interval)
                                    interval = null
                                    } catch(error){}
                                    
                                } 
                            }, 100);
                        }
                        
                    };


                    try {
                        await this.currentObserver.disconnect();
                        //await this.slides.item(t).scrollIntoView({block: 'start', behavior: "smooth"})
                        await window.scrollTo({top: targetScroll, behavior: scrollBehavior});
                        await scrollCallback()
                        await setTimeout(async ()=>{
                            clearInterval(interval)
                        }, 1000)
                    } catch (error) {
                        console.error('An error occurred during scrollTo:', error);
                    };
                }; 
            };

            


            //#endregion

            //#region Intersection Observer

            //Defines Intersection Observer objects for next and prev slides. 
            //Needed for scroll sliderMode instances to update slider position based on scroll position. 
            async initializeObservers() { 

                this.currentObserver = new IntersectionObserver((entries, observer) => {
                    //check('Observer Callback:')
                    //check('entries is:',  entries)
                    //check('Observer is:',  observer)
                    //check('Observer entries.length is:',  entries.length)
                    //check('Observer thresholds is', observer.threshold)
                    //check('Observer: observerOptions threshold is',this.observerOptions.threshold)

                    /*let checkButton = document.getElementById('observer-checker');
                    checkButton.addEventListener('click', (e) =>{
                        check('Observer Entries are: ', entries)
                    });
                    */

                    entries.forEach(target => {
                        let t = Number(target.target.getAttribute(this.slideIndexAttribute));

                        if (target.isIntersecting){
                            if(target.boundingClientRect.bottom > this.targetScrollPosition && target.boundingClientRect.top <= this.targetScrollPosition){
                                if(target.target != this.activeSlide){
                                    //check('Observer: Setting active slide to:', t)
                                    this.scrollTo(t)
                                } else { 
                                    //check(this.name,'Observer: Active slide:', t, 'intersection ratio is:', target.intersectionRatio) 
                                }
                            }else {
                                //check('Observer: Current slide reached bound condition');
                                if (target.boundingClientRect.top > this.targetScrollPosition) {
                                    //check('Top Observer Callback: Slide:', t)
                                    //check('top is at:', target.boundingClientRect.top, ' top observer slideTo: ', (t - 1));
                                    this.slideTo(t - 1)
                                    
                                };
                                if (target.boundingClientRect.bottom < this.targetScrollPosition) {
                                    //check('Bottom Observer Callback: Slide:', t)
                                    //check('bottom is at:', target.boundingClientRect.bottom, 'bottom observer slideTo: ', (t + 1));
                                    this.slideTo(t + 1);
                                };

                            };
                        } else {
                            //check('slide', t, 'is not intersecting')
                            this.observerUnobserve(target.target)
                        }
                    });

                }, this.observerOptions); 


                /*
                this.nextObserver = new IntersectionObserver((entries) => {
                    let target = entries[0];
                    (target.intersectionRatio > 0 && target.boundingClientRect.top <= this.targetScrollPosition) && this.slideTo(s.n.sIn); 

                }, this.observerOptions);

                this.prevObserver = new IntersectionObserver((entries) => {
                    let target = entries[0];
                    (target.intersectionRatio > 0 && target.boundingClientRect.bottom >= this.targetScrollPosition) && this.slideTo(s.p.sIn);

                }, this.observerOptions);
                */
            };

            async observerDisconnect() {
                this.currentObserver.disconnect()
            }

            async observerObserve(t){
                this.currentObserver.observe(t)
            }

            async observerUnobserve(t){
                this.currentObserver.unobserve(t)
            }

            async observerReset(){
                try {
                    //check(this.name, 'observerReset');
                    await this.observerDisconnect();
                    await this.initializeObservers();
                    await this.slides.forEach(async (el) => {
                        //check('Observer checking el: ', el.getAttribute(this.slideIndexAttribute))
                        this.observerObserve(el);
                        
                    });
                } catch (error) {
                    console.error('An error occurred during observerReset:', error);
                } 
            }


            /*
            //Starts observation of targeted next and prev slides. 
            //Needed to update observation target when slider position updates.
            startObserving(t) {
                //check('observing')
                this.slides.item(t) && this.currentObserver.observe(this.slides.item(t))
                //s.n.sEl && this.nextObserver.observe(s.n.sEl);
                //s.p.sEl && this.prevObserver.observe(s.p.sEl);
            };

            //Stops observation of targeted next and prev slides. 
            //Needed to update observation target when slider position updates.
            stopObserving(t) {
                //check('unobserving')
                this.slides.item(t) && this.currentObserver.unobserve(this.slides.item(t))
                //s.n.sEl && this.nextObserver.unobserve(s.n.sEl);
                //s.p.sEl && this.prevObserver.unobserve(s.p.sEl);
            };

            */

            //#endregion


            //#region Slider Sync

            async sliderLink(){
                let partner = this.linkedSlider;
                if (partner) {
                    partner.linkedSlider = this.slider
                    
                }

                /*
                check(this.name,'Slider Link: partner is',partner)
                if (this.activeSlide) {
                    this.ready = true;
                } else {
                    let interval = setInterval(() => {
                        partner = this.linkedSlider;
                        this.activeSlide = partner.activeSlide
                        check(this.name,'Sync waiting for ready')
                        if (this.activeSlide){
                            this.ready = true
                            this.responsiveInit();
                            check(this.name,'Ready Check True')
                            clearInterval(interval)
                        } 
                    }, 200);
    
                    setTimeout(()=>{
                        clearInterval(interval)
                    }, 1000)
                }
                */

                //check(this.name,'sliderLink complete')
            }

            //Synchronizes linked sliders.
            async sliderSync(t) {
                let partner = this.linkedSlider;


                if (partner && partner.activeSlide){
                    let partnerActiveIndex = partner.activeSlide.getAttribute(partner.slideIndexAttribute)
                    //check(this.name, 'Sync: partner and partner active slide', partnerActiveIndex)
                    if(partnerActiveIndex != t){
                        //check(this.name, 'tells partner to scrollTo;', t)
                        partner.scrollTo(t)}
                } else if (partner && !partner.activeSlide){
                    //check(this.name, ' Sync: partner but no active slide')
                    partner.updateSlider(t)
                };
                
            };

            //#endregion

            //#region Navigation

            //Adds event listeners to bullets to scroll to corresponding slide.
            //Remember to disable. See note above slideMode.
            async initBullets() {
                this.bullets.forEach((el) => { el.addEventListener("click", (e) =>{ this.slideTo(el.getAttribute(this.bulletIndexAttribute)) }); });
            };

            //Adds event listeners to arrows to scroll to corresponding slide
            async initArrows() { 
                
                this.prevArrow.addEventListener('click', (e) => {
                    let t = Number(this.activeSlide.getAttribute(this.slideIndexAttribute))
                    //check("Prev Arrow to,", t  - 1) 
                    if (this.activeSlide) {
                        this.slideTo(t - 1); }
                });
                this.nextArrow.addEventListener('click', (e) => {
                    let t = Number(this.activeSlide.getAttribute(this.slideIndexAttribute)) 
                    if (this.activeSlide)  {
                        //check("Next Arrow to,", t + 1)
                        this.slideTo(t + 1);} 
                });
            };

            //#endregion


            //#region Sidebar Function

            //Updates wrapper element height to equal height of active slide. 
            //Needed for slideHeight auto mode.
            async wrapperUpdateHeight() { 
                let h = this.activeSlide.getBoundingClientRect().height;
                //this.wrapperEl.style.height = `${h}px`;
                //check('Updated wrapper height to: ', h, 'of slide', this.activeSlide);
            };

            async wrapperFullHeight(){
                this.wrapperEl.style.height = '100vh'
            }

            /* Note: Removing this fixed an issue with the wrapper height being miscalculated somethimes when desc folded/unfolded
            async descUpdateHeight() {
                let descWraps = this.slideTextWraps
                descWraps.forEach((el, index) => {
                    let descH = this.slideText.item(index).getBoundingClientRect().height;
                    if (el.classList.contains('closed')){
                        el.style.height = 0;
                    } else {
                        //check('desc height is ',descH)
                        el.style.height = `${descH}px`;;
                    }
                });

            };
            */
            async textHide() {
                this.slideTextWraps.forEach((el) => {
                    //check('Closed desc')
                    el.classList.add('closed')
                    /*
                    if (!el.classList.contains('closed')) {
                        el.classList.add('closed');
                        check('Closed desc')
                    } else {eLog(' class closed already on: ', el)};
                    */
                });
            };

            async textShow() {
                this.slideTextWraps.forEach((el) => {
                    //check('Opened desc')
                    el.classList.remove('closed')

                    /*
                    if (el.classList.contains('closed')) {
                        el.classList.remove('closed');
                        check('Opened desc')
                    } else {
                        eLog('no slide text closed')};
                    */
                    
                });
            };

            //#region Unfold Buttons
            //Adds event listener to description unfold button to update the description elements state-based classes. 
            //Needed to show/hide description with button (for mobile)
            async initUnfoldButtons() {
                //check('Initizalizing initUnfoldButtons...')
                let uB = this.unfoldButtons;
                let closedClass = 'closed'
                //check('uB is: ', uB);

                this.updateUnfold = async (method, textVisible) => {
                    this.unfoldButtons.forEach((el) => {
                        el.classList[method](closedClass)

                    })

                    textVisible;
                };

                uB.forEach((el) => { 
                    //check('uB el is :', el);
                    el.addEventListener('click', async (e) => {
                        //check('UB Click')
                        
                        if (el.classList.contains(closedClass)){

                            //check('uB classList is:', uB.classList)
                            //check('uB.classList.contains(closed) is:', uB.classList.contains('closed'))

                            try {
                                //check('Updating Unfold')
                                await this.updateUnfold('remove', this.textShow());
                                //await this.wrapperFullHeight();
                            } catch (error) {
                                console.error(this.name,'An error occurred during updateUnfold:', error);
                            }

                            //el.classList.remove('closed');
                            //this.textShow();
                            
                        } else {

                            try {
                                //check('Updating Unfold')
                                await this.updateUnfold('add', this.textHide());
                                await this.wrapperUpdateHeight();
                            } catch (error) {
                                console.error(this.name,'An error occurred during updateUnfold:', error);
                            }
                            

                            //el.classList.add("closed");
                            //this.textHide();
                        };
                    });

                });

                
            };
            //#endregion
            //#region Responsive View Buttons


            async responsiveButtonInit(){
                let rB = this.responsiveButtons;
                //check('Responsive Button elements are:', rB)
                let mID = 'mobile-mode-button';

                let imgObserver = new ResizeObserver((entries) => {
                    entries.forEach(target => {
                        requestAnimationFrame(()=>{
                            requestAnimationFrame(()=>{
                                check('Image Observer Resize Callback...');
                                this.scrollTo(target.target.getAttribute(this.slideIndexAttribute), 'instant');
                                imgObserver.disconnect();
                            })

                        })

                        
                    })
                })

                rB.forEach((el)=>{
                    el.addEventListener('click', async (e) => {
                        //check('Responsive Button click')
                        let t = this.activeSlide.getAttribute(this.slideIndexAttribute)
                        //check('Responsive button: active slide is', t)
                        //check('Mobile view button is:',el.getAttribute('id'))
                        rB.forEach(el=>{
                            el.classList.remove('hidden')
                        })

                        el.classList.add('hidden');
                        
                        if ((el.getAttribute('id') === mID) && (this.mobileMode === false)){
                            //check('Mobile view button conditions are true')
                            try{
                                await this.observerDisconnect();
                                await imgObserver.observe(this.activeSlide)
                                await this.responsiveChange(true);
                                //check('Responsive button: scrollTo:', t)
                            } catch (error){
                                console.error('An error occured during Responsive Button Callback', error)
                            }
                            
                        } else if ((el.getAttribute('id') != mID) && (this.mobileMode === true)){ 
                            try{
                                await this.observerDisconnect();
                                await imgObserver.observe(this.activeSlide)
                                await this.responsiveChange(false);
                                //check('Responsive button: scrollTo:', t)
                            } catch (error){
                                console.error('An error occured during Responsive Button Callback', error)
                            }
                        };
                    });
                });

            };
        
        
        
        };
        //#endregion

        //#endregion

        //Defines slider class globally. Needed for creating Slider instances in onload code.
        window.Slider = Slider;        

    };


    //#region Onload Function
    function projectsOnloadJS() {

        contstructSliderClass();

        let slider1 = new Slider('main-slider-container', {
            slideMode: 'scroll',
            slideHeight: 'css',

        });

        let slider2 = new Slider('sidebar-slider-container', {
            slideMode: 'slide',
            slideHeight: 'auto',
            linkedSlider: slider1
        });

        window.addEventListener('scroll', (e) =>{
            //console.log('Window scrollY is:', window.scrollY)
        });
    };

    //#endregion

    onloadList.push(projectsOnloadJS)

})();
