"use strict";
(() => {
    function contstructSliderClass() {

        //Slider Class
        class Slider {

            //#region Constructor
            constructor(containerID, passedOptions = {}) {
                
                //allows external reference to slider object
                this.slider = this;
                //useful for logging tests to know which slider is doing what.
                this.name = containerID;

                //Logging Helper Functions
                this.check = (...passedContent) => { console.log(this.name, ...passedContent) };
                this.eLog = (...passedContent) => { console.error(this.name, ...passedContent) };
                

                //Gets container element
                this.container = document.getElementById(containerID);
                
                // helper function for getting the elements. Arg 1: selected element class. Arg 2: binary for choosing querSelector or querySelctorAll. Arg 3: querried object (e.g. slider container, document)
                this.queryFunction = (selector, all = false, container = undefined) => {
                    let queryObj;
                    container ? queryObj = container : (this && this.container) ? queryObj = this.container : this.eLog('invalid query object');
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
                    slideTextWrapClass: { val: '.project-info-wrap', acceptedTypes: ['string'] },
                    bulletedTextWraps: { val: '.project-process-wrap', acceptedTypes: ['string'] },
                    responsiveButtonClass: { val: '.responsive-mode-button', acceptedTypes: ['string'] },
                    responsiveMobileButton: {val: 'mobile-mode-button', acceptedTypes :['string']},
                    responsiveDesktopButton: {val: 'desktop-mode-button', acceptedTypes :['string']},
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
                        
                        //
                        await this.assignPositions(0)

                        await this.responsiveInit();

                        await this.observerOptionsCalculator();

                        await this.initializeObservers();

                        //Defines observer object and callbacks
                        

                        await this.updateSlider(0)

                        
                        

                    } catch (error) {
                        this.eLog('An error occurred during slider initialization:', error);
                    }
                
                    

                } else {
                    this.eLog("Slider initialization aborted due to invalid options.");
                }
            };

            //#endregion

            //#region Options Config
            //Options Configuration Validation
            async optionsTypeChecker(o) {
                for (let key in this.passedOptions) {
                    o[key].val = this.passedOptions[key];
                    if (o[key].val && o[key].acceptedTypes && (!o[key].acceptedTypes.includes(typeof o[key].val))) {
                        this.eLog(`${o[key]}`, 'receive invalid input type: ', `${(typeof o[key].val)}`, '. Accepted input types are: ', `${o[key].acceptedTypes}`);
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
                t.mobileButtonID = o.responsiveMobileButton.val;
                t.desktopButtonID = o.responsiveDesktopButton.val;
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
                        //this.check(,'Options Config disabled:', method);
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
                        'observerOptionsCalculator',
                        'observerObserve',
                        'observerUnobserve',
                        'observerDisconnect',
                        'imgSwap',
                        'toggleHideSlides',

                        
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
                let slideHeightAuto = () => {
                    //Creates an HTML style element through which CSS class styles can be modified.
                    /*
                    this.sliderStyleSheet = document.createElement('style');
                    this.sliderStyleSheet.title = 'projects-page-js-stylesheet';
                    document.head.appendChild(this.sliderStyleSheet);
                    */
                };

                //Defines function to be run when slideHeight is 'css'.
                let slideHeightCSS = () => {
                    //Disables adjusting wrapper height to current slide. Used when slides CSS position is relative, since wrapper is auto sized. 
                    disable('updateScrollMargin','stickyHeight');
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
                else {this.eLog('Invalid slider mode config');}

                //Conditional check of slideHeight to run corresponding config function.
                if (sH && slideHeightOptions[sH]) {slideHeightOptions[sH]()}
                else {this.eLog('Invalid slide height config');}
                
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
                        //Disables function to toggle unfold state.
                        'updateUnfold'
                    );
                };

                if (this.textBulletWraps.length < 1) {
                    disable(
                        'removeEmptyText'
                    );
                    //this.check(,'disabled removeEmptyText')
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
                    
                    : this.eLog('could not count: ', l);
                }
            };

            //Hide Empty Bullets Project Desc
            async removeEmptyText(){
                //this.check('textBulletWraps is', this.textBulletWraps)
                this.textBulletWraps.forEach(el=>{
                    //this.check(,'textBulletWraps el is', el)
                    let bulletText = el.querySelector('.project-desc');
                    if (bulletText.innerHTML.length < 1){
                        el.style.display = "none";
                        //this.check(,'removed empty bullet', el)
                    }
                })
            }

            async stickyHeight(){
                let headingWrapperHeight = document.querySelector('.page-header-container').getBoundingClientRect().height;
                //this.container.style.top = `calc(-${headingWrapperHeight}px - 6em)`;
                
            };

            //Calcualtes observer intersection ratios based on slide height and target transition position, then pushes them to observer.options.threshold.
            async observerOptionsCalculator(){
                await new Promise((resolve,reject) => {
                    //this.check('Observer Options Calculator')
                    let windowH = window.innerHeight;
                    //this.check('windowH', windowH)
                    //this.check('targetScrollPostion', this.targetScrollPosition)
                    //let windowW = window.innerWidth;
                    //let windowA = windowW * windowH;
                    ///this.check('target scroll position is', this.targetScrollPosition)
                    let remainderH = windowH - this.targetScrollPosition
                    //this.check('remainderH', remainderH)
                    //let mainA = windowW * this.targetScrollPosition;
                    //this.check('mainA', mainA)
                    //let remainderA = windowW * remainderH;
                    //this.check('remainderA', remainderA)
                    let slideMin = {slide:undefined, height: Infinity, width: 0, area: 0}
                    let slideMax = {slide:undefined, height: 0, width: 0, area: 0}
                    this.observerOptions.threshold = [0]
                    

                    //this.check(, 'Calculating thresholds...')
                    this.slides.forEach(el=>{
                        let h = el.getBoundingClientRect().height
                        let w = el.getBoundingClientRect().width
                    
                        if (slideMin.height > h){
                            slideMin.slide = el
                            slideMin.height = h
                            slideMin.width = w
                            slideMin.area = w * h
                            //this.check('h is:', h, 'el is:', el)
                            //this.check('slideMin.height: ', slideMin.height)
                        }
                        if (slideMax.height < h){
                            slideMax.slide = el
                            slideMax.height = h
                            slideMax.width = w
                            slideMax.area = w * h
                            //this.check('h is:', h, 'el is:', el)
                            //this.check('slideMax.height: ', slideMax.height)
                        }
                    })

                    //this.check('Largest slide is', slideMax.slide, 'height', slideMax.height, 'and smalles slide is', slideMin.slide, 'height', slideMin.height)

                    let minRatioAbove = Math.round((this.targetScrollPosition / slideMin.height ) * 100)
                    let maxRatioAbove = Math.round((this.targetScrollPosition / slideMax.height) * 100)
                    
                    let minRatioBelow = Math.round((remainderH / slideMin.height) * 100)
                    let maxRatioBelow = Math.round((remainderH / slideMax.height) * 100)

                    //this.check( 'maxRatioAbove:', maxRatioAbove/100 , ' minRatioAbove:', minRatioAbove/100, ' maxRatioBelow:', maxRatioBelow/100, ' minRatioBelow:', minRatioBelow/100)

                    for(let i = 0; i < (minRatioBelow + 5) && i <= 100; i++){
                        if (i > 0) {this.observerOptions.threshold.push(i /100)}
                    }
                    for(let i = (maxRatioAbove - 5); i < (minRatioAbove + 5) && i <= 100; i++){
                        if (i > 0) {this.observerOptions.threshold.push(i /100)}
                    }
                    
                    //this.check(, 'observerOptions.threshold is', this.observerOptions.threshold);
                    //this.check('Observer root element is:', this.observerOptions.root)

                    resolve()
                });
                
                
                

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
                        await this.updateUnfold('remove')
                        await this.observerOptionsCalculator();
                        await this.observerReset();
                        await this.updateScrollMargin();
                    } catch (error) {
                        this.eLog(`An error occurred during windowResize, where windowW >= ${this.verticalBreakpoint}`, error);
                    }
                    //Un-folds folded descriptions.
                    this.updateUnfold('remove')
                    this.observerReset();
                    this.updateScrollMargin();
                } else {
                    try{
                        //Un-folds folded descriptions.
                        this.verticalLayout = true;
                        await this.updateUnfold('add', this.textHide())
                        await this.observerOptionsCalculator();
                        await this.observerReset();
                        await this.updateScrollMargin();
                    } catch (error) {
                        this.eLog(`An error occurred during windowResize, where windowW < ${this.verticalBreakpoint} `, error);
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
                    this.eLog('An error occurred during windowResize:', error)
                }
                
                
            }

            async toggleHideSlides(method) {
                //this.check('toggleHideSlides', method)
                
                for (let el of this.slides.values()){
                    await new Promise((resolve)=>{
                        //this.check('toggleHideSlides: el is', el)
                        el.classList[method]('hidden')
                        resolve();
                    });
                }

                await new Promise((resolve)=>{
                    setTimeout(()=>{
                        //this.check('toggleHideSlides complete');
                        resolve();
                    }, 500)  
                });
            }; 

            async imgSwap(urlAttr) {
                //this.check('ImgSwap') 
                for (let el of this.slides.values()){
                    await new Promise((resolve)=>{
                        let img = el.querySelector('.project-image');
                        //this.check('imgSwap resized img', img)
                        img.setAttribute('src', img.getAttribute(urlAttr));
                        resolve()
                    })
                    
                }
                
                await new Promise((resolve)=>{
                    setTimeout(()=>{
                       //this.check('imgSwap finished');
                        resolve();
                    }, 500)
                });
                
            };

            async modeSwap(urlAttr){
                //this.check('modeSwap...')
                try {
                    await this.observerDisconnect();
                    await this.toggleHideSlides('add');
                    await this.imgSwap(urlAttr); 
                    await this.scrollTo(this.activeSlide.getAttribute(this.slideIndexAttribute), 'instant');
                    await this.toggleHideSlides('remove')
                    await this.observerObserve(this.activeSlide);
                } catch (error) {
                    this.eLog('An error occurred during modeSwap to:', urlAttr, error);
                }
                
            };

            async responsiveChange(v) {
                if (this.mobileMode === false && v){
                    //this.check('Responsive Change: Mobile')
                    try{
                        this.mobileMode = true;
                        await this.modeSwap('mobile-img-url');
                        await this.toggleResponsiveButtons('mobile')
                    } catch (error) {
                        this.eLog('An error occurred during ResponsiveChange to mobile mode', error);
                    }
                    
                    
                } else if (this.mobileMode === true && !v){
                    //this.check('Responsive Change: Desktop')
                    try{
                        this.mobileMode = false;
                        await this.modeSwap('desktop-img-url');
                        await this.toggleResponsiveButtons('desktop')
                    } catch (error) {
                        this.eLog('An error occurred during ResponsiveChange to desktop mode', error);
                    }
                    
                } else {
                    //this.check('Responsive Change: No change')
                }

            };

            //Adds event listener for window resize. Ensures slider functions that are affected by window size are updated on window resize.
            async responsiveInit(){
                //this.check('Responsive Init: Window width is', this.windowW);
                window.addEventListener('resize',(e) => {
                    this.windowResize(); 
                })

                if (this.windowW <= this.mobileBreakpoint){
                    //this.check('Responsive Init: Mobile')
                    this.mobileMode = true;
                    this.verticalLayout = true
                    try{
                        await this.updateUnfold('add');
                        await await this.observerDisconnect();
                        await this.toggleHideSlides('add');
                        await this.imgSwap('mobile-img-url'); 
                        await this.toggleHideSlides('remove')
                        await this.toggleResponsiveButtons('mobile')
                    } catch (error){this.eLog(error)};
                    
                } else if (this.windowW < this.verticalBreakpoint && this.windowW > this.mobileBreakpoint){
                    //this.check('Responsive Init: Tablet')
                    this.verticalLayout = true
                    this.mobileMode = false;
                    try{
                        await this.updateUnfold('add');
                        await this.toggleResponsiveButtons('desktop')
                    } catch (error){this.eLog(error)};
                     

                } else {
                    //this.check('Responsive Init: Desktop')
                    this.mobileMode = false;
                    try{
                        await this.toggleResponsiveButtons('desktop')
                    } catch (error){this.eLog(error)}
                }



                //Initial call to update sticky height to correct value. Later calls will be made by this.windowResize.
                this.stickyHeight();

            }

            

            //#endregion
            
            
            //#region Slider Functions

            //Removes positional classes from slides and/or bullets. 
            async removeClasses() {
                let sE = this.syncedElements;
                for (let key in sE){
                    //this.check(, 'syncedElements key is', key, 'and list is', this.syncedElements[key].list)
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
                //this.check(, 'Updating Current Slide to', t)
                this.activeSlide = this.slides.item(t)
            }

            //Core Function: Syncronizes the active position of the slider when active slide is updated. 
            //Updates positional varibles and corresponding classes, controls Intersection Obserever targeting, syncs bullets. 
            async updateSlider(t) {
                if (this.slides.item(t)) {
                    try {
                        this.check('updateSlider:', t)
                        await this.currentObserver.disconnect();
                        await this.assignPositions(t);
                        await this.removeClasses();
                        await this.addClasses();
                        await this.updateScrollMargin(t) 
                        await this.observerObserve(this.slides.item(t));
                        await new Promise((resolve)=>{
                            //this.check('UpdateSlider finished')
                            resolve();
                        }) 
                    } catch (error) {
                        this.eLog('An error occurred during updateSlider:', error);
                    }
                }

            };
            
            async slideTo(t) {
                if (this.slides.item(t)) {
                    try {
                        //this.check('slideTo:', t)
                        await this.updateSlider(t)
                        await this.sliderSync(t)
                    } catch (error) {
                        this.eLog('An error occurred during slideTo:', error);
                    }
                }
            };

            

            scrollTo = async (t, scrollBehavior = 'smooth') => {
                let target = this.slides.item(t)
                if(target) {
                    //this.check('Scroll To:', t)
                    target.scrollIntoView({behavior: scrollBehavior});
                    
                }; 
            };

            


            //#endregion

            //#region Intersection Observer

            //Defines Intersection Observer objects for next and prev slides. 
            //Needed for scroll sliderMode instances to update slider position based on scroll position. 
            async initializeObservers() { 

                this.currentObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(target => {
                        let t = Number(target.target.getAttribute(this.slideIndexAttribute));
                        //this.check('Observer Callback')
                        //this.check('observer.thresholds', observer.thresholds)
                        //this.check('this.observerOptions.threshold', this.observerOptions.threshold)

                        if (target.isIntersecting){
                            if(target.boundingClientRect.bottom > this.targetScrollPosition && target.boundingClientRect.top <= this.targetScrollPosition){
                                if(target.target != this.activeSlide){
                                    //this.check('Observer: Setting active slide to:', t)
                                    this.slideTo(t)
                                    //this.scrollTo(t);
                                } else {
                                    //this.check('Observer: Active slide:', t, target.target, 'intersection ratio is:', target.intersectionRatio) 
                                }
                            }else {
                                //this.check('Observer: Current slide reached bound condition');
                                if (target.boundingClientRect.top > this.targetScrollPosition) {
                                    //this.check('Top Observer Callback: Slide:', t)
                                    //this.check('top is at:', target.boundingClientRect.top, ' top observer slideTo: ', (t - 1));
                                    this.slideTo(t - 1)
                                    
                                };
                                if (target.boundingClientRect.bottom < this.targetScrollPosition) {
                                    //this.check('Bottom Observer Callback: Slide:', t)
                                    //this.check('bottom is at:', target.boundingClientRect.bottom, 'bottom observer slideTo: ', (t + 1));
                                    this.slideTo(t + 1);
                                };

                            };
                        } else {
                            //this.check('slide', t, 'is not intersecting')
                            this.observerUnobserve(target.target)
                        }
                    });

                }, this.observerOptions); 

            };

            async observerDisconnect() {
                if (this.currentObserver){this.currentObserver.disconnect()}
            }

            async observerObserve(t){
                this.check('observerObserve')
                if (this.currentObserver){this.currentObserver.observe(t)}
            }

            async observerUnobserve(t){
                if (this.currentObserver){this.currentObserver.unobserve(t)}
            }

            async observerReset(){
                try {
                    //this.check(, 'observerReset');
                    await this.observerDisconnect();
                    await this.initializeObservers();
                    await this.slides.forEach(async (el) => {
                        //this.check('Observer checking el: ', el.getAttribute(this.slideIndexAttribute))
                        this.observerObserve(el);
                        
                    });
                } catch (error) {
                    this.eLog('An error occurred during observerReset:', error);
                } 
            }



            //#endregion


            //#region Slider Sync

            async sliderLink(){
                let partner = this.linkedSlider;
                if (partner) {
                    partner.linkedSlider = this.slider
                    
                }

            }

            //Synchronizes linked sliders.
            async sliderSync(t) {
                let partner = this.linkedSlider;


                if (partner && partner.activeSlide){
                    let partnerActiveIndex = partner.activeSlide.getAttribute(partner.slideIndexAttribute)
                    //this.check(, 'Sync: partner and partner active slide', partnerActiveIndex)
                    if(partnerActiveIndex != t){
                        //this.check(, 'tells partner to scrollTo;', t)
                        partner.scrollTo(t)}
                } else if (partner && !partner.activeSlide){
                    //this.check(, ' Sync: partner but no active slide')
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
                    //this.check("Prev Arrow to,", t  - 1) 
                    if (this.activeSlide) {
                        this.slideTo(t - 1); }
                });
                this.nextArrow.addEventListener('click', (e) => {
                    let t = Number(this.activeSlide.getAttribute(this.slideIndexAttribute)) 
                    if (this.activeSlide)  {
                        //this.check("Next Arrow to,", t + 1)
                        this.slideTo(t + 1);} 
                });
            };

            //#endregion


            //#region Sidebar Function

            //Updates wrapper element height to equal height of active slide. 
            //Needed for slideHeight auto mode.
            async updateScrollMargin(t) {
                let h;
                if (this.mobileMode === true){
                    h = this.slides.item(t).getBoundingClientRect().height;
                } else {
                    h = 0;
                }
                
                document.documentElement.style.setProperty('--slide-top-offset', `${h}px`)
            };

            async wrapperFullHeight(){
                this.wrapperEl.style.height = '100vh'
            }

            //#region Unfold Buttons
            //Adds event listener to description unfold button to update the description elements state-based classes. 
            //Needed to show/hide description with button (for mobile)
            async initUnfoldButtons() {
                //this.check('Initizalizing initUnfoldButtons...')
                let uB = this.unfoldButtons;
                let closedClass = 'closed'
                //this.check('uB is: ', uB);

                this.updateUnfold = async (method, textVisible) => {
                    await new Promise((resolve)=>{
                        //this.check('UpdateUnfold Start', method)
                    
                        for (let button of this.unfoldButtons.values()){
                            new Promise((resolve)=>{
                                //this.check('UpdateUnfold: button')
                                button.classList[method](closedClass)
                                resolve();
                            })
                        }
                        //this.check('Udate unfold this.slides.values:', this.slides.values())
                        for(let slide of this.slides.values()){
                            //this.check('Update Unfold: slide')
                            new Promise((resolve)=>{
                                
                                slide.classList[method](closedClass)
                                resolve();
                            })
                        }

                        resolve();
                    })
                    
                };

                uB.forEach((el) => { 
                    //this.check('uB el is :', el);
                    el.addEventListener('click', async (e) => {
                        //this.check('UB Click')
                        
                        if (el.classList.contains(closedClass)){

                            //this.check('uB classList is:', uB.classList)
                            //this.check('uB.classList.contains(closed) is:', uB.classList.contains('closed'))

                            try {
                                //this.check('Updating Unfold')
                                await this.updateUnfold('remove');
                                //await this.wrapperFullHeight();
                            } catch (error) {
                                this.eLog('An error occurred during updateUnfold:', error);
                            }

                            //el.classList.remove('closed');
                            //this.textShow();
                            
                        } else {

                            try {
                                //this.check('Updating Unfold')
                                await this.updateUnfold('add');
                                await this.updateScrollMargin();
                            } catch (error) {
                                this.eLog('An error occurred during updateUnfold:', error);
                            }
                            

                            //el.classList.add("closed");
                            //this.textHide();
                        };
                    });

                });

                
            };
            //#endregion
            //#region Responsive View Buttons

            async toggleResponsiveButtons(hide) {
                try {
                  await new Promise((resolve, reject) => {
                    let mobileButton = document.getElementById(this.mobileButtonID);
                    let desktopButton = document.getElementById(this.desktopButtonID);
              
                    if (hide === 'mobile') {
                        mobileButton.classList.add('hidden');
                        desktopButton.classList.remove('hidden');
                        resolve();
                        
                    } else if (hide === 'desktop') {
                     
                        desktopButton.classList.add('hidden');
                        mobileButton.classList.remove('hidden');
                        resolve();
                      
                    } else {
                      reject('toggleResponsiveButtons received invalid argument for "hide"');
                    }
                  });
                } catch (error) {
                  this.eLog('Error in toggleResponsiveButtons:', error);
                  throw new Error(error);
                }
            };
              
            async responsiveButtonInit(){
                let rB = this.responsiveButtons;
                //this.check('Responsive Button elements are:', rB)
                let mID = this.mobileButtonID;

                rB.forEach((el)=>{
                    el.addEventListener('click', async (e) => {
                        //this.check('Responsive Button click')
                        let t = this.activeSlide.getAttribute(this.slideIndexAttribute)
                        //this.check('Responsive button: active slide is', t)
                        //this.check('Mobile view button is:',el.getAttribute('id'))
                        
                        if ((el.getAttribute('id') === mID) && (this.mobileMode === false)){
                            //this.check('Mobile view button conditions are true')
                            try{
                                await this.responsiveChange(true);
                                //this.check('Responsive button: scrollTo:', t)
                            } catch (error){
                                this.eLog('An error occured during Responsive Button Callback', error)
                            }
                            
                        } else if ((el.getAttribute('id') != mID) && (this.mobileMode === true)){ 
                            try{;
                                await this.responsiveChange(false);
                                //this.check('Responsive button: scrollTo:', t)
                            } catch (error){
                                this.eLog('An error occured during Responsive Button Callback', error)
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
        
        setTimeout(()=>{
            window.scrollTo({
                top:0,
                left:0,
                behavior: 'instant',
            })

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
                //this.check('Window scrollY is:', window.scrollY)
            });
        }, 100)
        
    };

    //#endregion
    //Adds function to global onload function from site-header-js
    onloadList.push(projectsOnloadJS);

})();

