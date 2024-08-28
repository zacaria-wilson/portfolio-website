function contstructSliderClass() {
    
    //Helper Function: Error Logging
    function eLog(...logInput) { 
        console.error(...logInput)
    }

    function check(...logInput) { 
        console.log(...logInput)
    }

    //Slider Class
    class Slider {
        constructor(containerID, passedOptions = {}) {
            
            this.slider = this;
            
            this.container = document.getElementById(containerID);
            check('Slider is:', this.slider);
            
            this.queryFunction = (selector, all = false, container = undefined) => {
                let queryObj;
                container ? queryObj = container : (this && this.container) ? queryObj = this.container : eLog('invalid query object');
                return all ? queryObj.querySelectorAll(selector) : queryObj.querySelector(selector);
            };

            this.options = {
                wrapperClass: { val: '.slider-wrapper', acceptedTypes: ['string'] },
                slidesClass: { val: '.slider-slide', acceptedTypes: ['string'] },
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
                slideTextWrapClass: { val: '.project-desc-wrap', acceptedTypes: ['string'] },
                transitionPoint: { val: window.innerHeight * 0.8, acceptedTypes: ['number'] },
                slideMode: { val: 'scroll', acceptedTypes: ['string'] },
                childSlider: {val: undefined, acceptedTypes:['object']}

            };
            this.passedOptions = passedOptions;

            this.observerOptions = {
                root: null,
                rootMargin: '0px', 
                threshold: [0, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95],
            };
            
            this.init();

        };

        //Initialization function
        init() {
            //Verifies options configuration is correct and initializes slider functions
            if (this.optionsTypeChecker(this.options)) {
                //Sets class scoped elements based on options (default and passed). Needed for all global references.
                this.initClassVars(this.options,this.queryFunction);
                //Indexes slides and bullets.
                this.elementCounter(this.slides);
                this.elementCounter(this.bullets);
                this.elementCounter(this.unfoldButtons);
                //Disables methods based on options configuration.
                this.optionsConfig();
                //init observers
                this.initializeObservers(this.slidePositions);
                //Starts slider at 0 index
                this.startSlider(this.slidePositions, 0)
                //Start bullets
                this.initBullets();
                //init arrows 
                this.initArrows(this.slidePositions);
                //init unfold button
                this.initUnfoldButtons();
                //check('unfold button init');

            } else {
                eLog("Slider initialization aborted due to invalid options.");
            }
        };

        //Options Configuration Validation
        optionsTypeChecker(o) {
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
        initClassVars(o,$) {
            let t = this;
            t.wrapperEl = $(o.wrapperClass.val);
            t.slides = $(o.slidesClass.val, true);
            t.slideHeightVal = o.slideHeight.val
            t.slideIndexAttribute = o.slideIndexAttribute.val;
            t.slidePositions = { c: {sEl: null, sIn: null, sC:'active-slide'}, p: {sEl: null, sIn: null, sC:'prev-slide'}, n: {sEl: null, sIn: null, sC:'next-slide'} };
            t.targetScrollPosition = o.transitionPoint.val;
            t.bullets = $(o.bulletsClass.val, true);
            t.activeBulletClass = o.activeBulletClass.val;
            t.bulletIndexAttribute = o.bulletIndexAttribute.val;
            t.prevArrow = $(o.prevEl.val);
            t.nextArrow = $(o.nextEl.val);
            t.unfoldButtons = $(o.unfoldButtons.val, true);
            t.unfoldIndexAttribute = o.unfoldIndexAttribute.val;
            t.slideText = $(o.slideTextClass.val, true)
            t.slideTextWraps = $(o.slideTextWrapClass.val, true)
            t.sliderMode = o.slideMode.val;
            t.childSlider = o.childSlider.val;
        };

        //Gives each element in a nodelist and indexing attribute. Needed for bullets navigation to move the slider to a particular slide and sync bullets. 
        elementCounter(l) {
            for (let i = 0; i < l.length; i++) { 
                this.slides && l === this.slides ? l.item(i).setAttribute(this.slideIndexAttribute, i)
                    
                : this.bullets && l === this.bullets ? l.item(i).setAttribute(this.bulletIndexAttribute, i)
                
                : this.unfoldButtons && l === this.unfoldButtons ? l.item(i).setAttribute(this.unfoldIndexAttribute, i)
                
                : eLog('could not count: ', l);
            }
        };

        //Checks the slider mode (slide or scroll) of the Slider instance and disables unused class methods.
        //Needed to execute class methods without unused elements/functions causing undefined errors.
        optionsConfig() {
            let sM = this.sliderMode;
            let sH = this.slideHeightVal;

            let sliderModeSlide = () => { 
                this.initializeObservers = function() { return; };
                this.startObserving = function() { return; };
                this.stopObserving = function() { return; };
                this.scrollTo = function() { return; };
                this.navClick = (t) => { this.slideTo(t); }
            };

            let sliderModeScroll = () => { 
                this.navClick = (t) => { this.scrollTo(t); }
            };

            
            let slideHeightAuto = () => { return; };

            let slideHeightCSS = () => {
                this.wrapperUpdateHeight = function () { return; };
            };

            let slideHeightOptions = {
                'auto': slideHeightAuto,
                'css': slideHeightCSS,
            };
            
            let sliderModeOptions = {
                'slide': sliderModeSlide,
                'scroll': sliderModeScroll
            };

            sM && sliderModeOptions[sM] ? sliderModeOptions[sM]()
            : eLog('Invalid slider mode config');
            
            sH && slideHeightOptions[sH] ? slideHeightOptions[sH]()
            : eLog('Invalid slide height config');
            
            if (this.bullets.length < 1) { this.initBullets = function () { return; }; };
            if (!(this.prevArrow && this.nextArrow)) { this.initArrows = function () { return; };};
            if (this.unfoldButtons.length < 1) { this.initUnfoldButtons = function () { return; }; };
            if (this.slideText.length < 1) { 
                check('text hide/show disabled on slider: ', this)
                this.textHide = function () { return; };
                this.textShow = function () { return; };
            };
                
        }
        
        //Removes positional classes from slides or bullets. 
        //Argument l determines which type of element and how to handle class modification. 
        //Argument t is the index of the targeted element, needed for index-based navigation like bullets. 
        removeClasses(l, t = -1) {
            let s = this.slidePositions;
            if (s && l === s) {
                for (let el in l) {
                    l[el].sEl && l[el].sEl.classList.remove(l[el].sC);
                };
            } else if ((this.bullets.length > 0)  && l === this.bullets) { 
                    check('removing bullets')

                    l.item(t) && l.item(s.c.sIn).classList.remove(this.activeBulletClass)
                
            }
        };

        //Adds positional classes from slides or bullets. 
        //Argument l determines which type of element and how to handle class modification. 
        //Argument t is the index of the targeted element, needed for index-based navigation like bullets.
        addClasses(l, t = -1) {
            if (this.slidePositions && l === this.slidePositions) {
                for (let el in l) {
                    l[el].sEl && l[el].sEl.classList.add(l[el].sC);
                };
            } else if ((this.bullets.length > 0) && l === this.bullets) { 

                    l.item(t) && l.item(t).classList.add(this.activeBulletClass);
                
            } 
        };
        
        assignPositions(s,t) {
            let slides = this.slides
            s.p.sEl = slides.item(t - 1)
            s.p.sIn = t - 1;
            s.c.sEl = slides.item(t)
            s.c.sIn = t;
            s.n.sEl = slides.item(t + 1)
            s.n.sIn = t + 1;
        }

        startSlider(s, t) {
            this.slides.forEach((el) => { 
                this.currentObserver.observe(el)
            });
            this.sliderLink();
            this.addClasses(s);
            this.addClasses(this.bullets, t);
            this.wrapperUpdateHeight(s);
            this.startObserving(s);
        }

        //Core Function: Syncronizes the active position of the slider when active slide is updated. 
        //Updates positional varibles and corresponding classes, controls Intersection Obserever targeting, syncs bullets. 
        updateSlider(targetSlideIndex) {
            check('Updating Slider:')
            let s = this.slidePositions;
            let t = targetSlideIndex;

            this.stopObserving(s)
            
            this.removeClasses(s);
            this.removeClasses(this.bullets, t);

            this.assignPositions(s,t);

            this.addClasses(s);
            this.addClasses(this.bullets, t);
            
            this.scrollTo(t);

            //this.sliderSync(t)

            this.wrapperUpdateHeight(t);

            setTimeout(()=>{
                this.startObserving(s);
            }, 750);
            


        };
        
        slideTo(t) {
            if (this.slides.item(t)) {
                check('sliding to:', this.slides.item(t).getAttribute('slide-index'));
                this.updateSlider(t);
            }
        };

        scrollTo(t) { 
            if(this.slides.item(t)) {
                let y = this.slides.item(t).offsetTop
                check('scrolling to slide: ', this.slides.item(t).getAttribute('slide-index'),' at y: ', y)
                window.scrollTo({top: y, behavior: 'smooth'})
                //this.slides.item(t).scrollIntoView({block: 'start', behavior: "smooth"})
                }; 
        };

        //Defines Intersection Observer objects for next and prev slides. 
        //Needed for scroll sliderMode instances to update slider position based on scroll position. 
        initializeObservers(s) { 

            this.currentObserver = new IntersectionObserver((entries) => {
                let target = entries[0];
                //check('observing:', target);
                if (target.intersectionRatio > 0 && target.boundingClientRect.top > this.targetScrollPosition) {
                    check('Top Observer Callback: current slide:', target.target.getAttribute('slide-index'), 'top is at:', target.boundingClientRect.top, ' top observer slideTo: ', s.p.sIn);
                    this.slideTo(s.p.sIn);
                };
                if (target.intersectionRatio > 0 && target.boundingClientRect.bottom < this.targetScrollPosition) {
                    check('Bottom Observer Callback: current slide:', target.target.getAttribute('slide-index'), 'bottom is at:', target.boundingClientRect.bottom, 'bottom observer slideTo: ', s.n.sIn);
                    this.slideTo(s.n.sIn);
                }; 

                if (target.isIntersecting && target.boundingClientRect.bottom > this.targetScrollPosition && target.boundingClientRect.top <= this.targetScrollPosition) {
                    this.assignPositions(s, target.target.getAttribute(this.slideIndexAttribute));
                } else {
                    this.currentObserver.unobserve(target);
                };
                

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

        //Starts observation of targeted next and prev slides. 
        //Needed to update observation target when slider position updates.
        startObserving(s) {
            //check('observing')
            s.c.sEl && this.currentObserver.observe(s.c.sEl)
            //s.n.sEl && this.nextObserver.observe(s.n.sEl);
            //s.p.sEl && this.prevObserver.observe(s.p.sEl);
        };

        //Stops observation of targeted next and prev slides. 
        //Needed to update observation target when slider position updates.
        stopObserving(s) {
            //check('unobserving')
            s.c.sEl && this.currentObserver.unobserve(s.c.sEl)
            //s.n.sEl && this.nextObserver.unobserve(s.n.sEl);
            //s.p.sEl && this.prevObserver.unobserve(s.p.sEl);
        };

        sliderLink(){
            let child = this.childSlider;
            if (child) { child.parentSlider = this;}
        }

        //Synchronizes linked sliders.
        sliderSync(t) {
            let child = this.childSlider;
            let parent = this.parentSlider;

            if (child  && (child.slidePositions.c.sEl.getAttribute(child.slideIndexAttribute) != t )){ child.slideTo(t); }; 
            if (parent && (parent.slidePositions.c.sEl.getAttribute(parent.slideIndexAttribute) != t)){ parent.slideTo(t); };
        };


        //Adds event listeners to bullets to scroll to corresponding slide.
        //Remember to disable. See note above slideMode.
        initBullets() {
            this.bullets.forEach((el) => { el.addEventListener("click", (e) =>{ this.navClick(el.getAttribute(this.bulletIndexAttribute)) }); });
        };

        //Adds event listeners to arrows to scroll to corresponding slide
        initArrows(s) {
            this.prevArrow.addEventListener('click', (e) => { s.p.sEl && this.navClick(s.p.sIn); });
            this.nextArrow.addEventListener('click', (e) => { s.n.sEl && this.navClick(s.n.sIn); });
        };

        //Updates wrapper element height to equal height of active slide. 
        //Needed for slideHeight auto mode.
        wrapperUpdateHeight(t) { 
            let h = this.slides.item(t).offsetHeight;
            this.wrapperEl.style.height = `${h}px`;
            check('wrapper height set to: ', h);
        };

        descUpdateHeight() {
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
        
        textHide() {
            this.slideTextWraps.forEach((el) => {
                if (!el.classList.contains('closed')) {
                    el.classList.add('closed');
                } else {eLog(' class closed already on: ', el)};
            });
        };

        textShow() {
            this.slideTextWraps.forEach((el) => {
                if (el.classList.contains('closed')) {
                    el.classList.remove('closed');
                } else {
                    eLog('no slide text closed')};
            });
        };


        //Adds event listener to description unfold button to update the description elements state-based classes. 
        //Needed to show/hide description with button (for mobile)
        initUnfoldButtons() {
            //check('start initUnfoldButtons')
            let uB = this.unfoldButtons;
            //check('uB is: ', uB);

            uB.forEach((el,index) => { 
                el.addEventListener('click', (e) => {
                    check('uB el is :', el);
                    if (el.classList.contains('closed')){
                        //check('uB classList is:', uB.classList)
                        //check('uB.classList.contains(closed) is:', uB.classList.contains('closed'))
                        el.classList.remove('closed');
                        this.textShow();
                        
                    } else {
                        check()
                        el.classList.add("closed");
                        this.textHide();
                    };
                    this.descUpdateHeight()
                    this.wrapperUpdateHeight(index)
                });

            });
            this.descUpdateHeight()
            this.textShow();
        };
    };
    
    window.Slider = Slider;        

};



function onloadJS() {

    contstructSliderClass();

    let slider1 = new Slider('main-slider-container', {
        slideMode: 'scroll',
        slideHeight: 'css',

    });

    let slider2 = new Slider('sidebar-slider-container', {
        slideMode: 'slide',
        slideHeight: 'auto',
        childSlider: slider1
    });

    function headingAnimation(){
        let firstSlide = slider1.slides.item(0);
        let headingWrap = document.getElementById('heading-wrapper');
        let initPos = firstSlide.getBoundingClientRect.top;
        console.log('initPos is:', initPos)

        let options = {
            root: null,
            rootMargin: '0px', 
            threshold: [0, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95],
        };
        
        let firstObserver = new IntersectionObserver((entries) => {
            let target = entries[0];
            check('first observer callback');
            (target.boundingClientRect.top < initPos) && headingWrap.classList.add('hidden');
            (target.boundingClientRect.top >= initPos) && headingWrap.classList.remove('hidden'); 

        }, options);

        firstObserver.observe(firstSlide);
    
    }

    //headingAnimation();
}

function executeOnloadJS() {

    if (window.addEventListener){window.addEventListener("DOMContentLoaded", onloadJS, false);}
    
    else if (window.attachEvent){window.attachEvent("DOMContentLoaded", onloadJS);}
    
    else {window.onload = onloadJS();}
}
    
executeOnloadJS();