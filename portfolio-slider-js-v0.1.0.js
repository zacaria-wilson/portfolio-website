/*Notes: 
1. Removed intersection observer int/disconnect from slideChange function bc I don't want that executing for swiper2. 
    Need to adjust all slide changing functions accordingly or figure out a way to only refer to swiper 1. 
    Maybe I use the Slider function only for swiper1 and make some kind of swiper sync function to affect swiper2.
    For that, might need put symmetrical variables & functions into another function that both can refer to, then have separate Slider# functions that also include asymetrical functions.
    Or maybe, put functions into if statements that are true for certain parameters (maybe "hasNav:true,hasBullets:true" or maybe just 'isSwiper1:true').
2. Need to declare variables for Slider(swiper#) above Slider function so i can use variable.function();
3. Anywhere there is Slider(swiper#).function, need to change to variable.function.
4. Maybe need to add return functions (see chat GTPT 11/27) to use variables from inside Slider for nav & bullets.
5. Maybe using aria labels for indexing could solve some of the issues with needing to refer to slidelist variables outside of Slider.

*/

/* Notes 12.27.23:
1. I may have solved all of the above issues by 
*/

$(document).ready(function () {

    $(".slider-main_component").each(function (index) {
        
        /* GLOBAL VARIABLES */

        //image swiper CMS list element
        const swiper1 = document.querySelector('.image-swiper');
        //content swiper CMS list element
        const swiper2 = document.querySelector('.content-swiper');
        //define middle of screen for intersection observers
        let targetScrollPosition = window.innerHeight * 0.5; // 50vh
        //nodelist of pagination bullets
        const bullets = document.querySelectorAll('.swiper-pagination-bullet');
        //prev arrow
        const prevArrow = document.querySelector('.swiper-prev');
        //next arrow
        const nextArrow = document.querySelector('.swiper-next');


        
        /* Slider Functions */
        
        function Slider(sliderInstance) {


            //
            const swiperWrapper = sliderInstance.querySelector('.swiper-wrapper');
            const slideList = swiperWrapper.querySelectorAll(".swiper-slide");

            //
            let current;
            let prev;
            let next;
            let targetSlideIndex;
            
            //
            function startSlider() {
                current = slideList.querySelector('.active-slide') || slideList.firstElementChild;
                prev = current.previousElementSibling;
                next = current.nextElementSibling;
                console.log(current, prev, next);

            };

            //
            function applyClasses(){
                current.classList.add('active-slide');
                prev.classList.add('prev-slide');
                next.classList.add('next-slide');
            };

            //
            function slideChange (targetSlideIndex){
                //define slide locating classes to remove
                const classesToRemove = ['active-slide', 'prev-slide', 'next-slide'];
                //remove locating classes from slides
                [prev, current, next].forEach(el => el.classList.remove(...classesToRemove));
                //for slider1 only, disconnect intersection observers
                if(sliderInstance == swiper1){
                    disconnectObservers();
                };
                //set slide locations to new slides
                prev = slideList.item(targetSlideIndex - 1);
                current = slideList.item(targetSlideIndex);
                next = slideList.item(targetSlideIndex + 1);
                //add locating classes to slides
                applyClasses();
                //for slider1 only, reconnect intersection observers
                if(sliderInstance == swiper1){
                    initObservers();
                };
                
            };
            
            //function to advance slider 1 slide
            function slideNext(){
                //set targetSlideIndex to -1 so that 
                targetSlideIndex = -1
                slideList.forEach((element, index) => {
                    if (element === next) {
                      targetSlideIndex = index;
                    };
                    if(targetSlideIndex > -1){
                        //advance slide
                        slideChange(targetSlideIndex);
                    } else {
                        console.log("reached end of slides")
                    };
                });
            };

            //function to reverse slider 1 slide
            function slidePrev(){
                targetSlideIndex = -1
                    slideList.forEach((element, index) => {
                        if (element === prev) {
                        targetSlideIndex = index;
                    };
                    if(targetSlideIndex > -1){
                        //back slide
                        slideChange(targetSlideIndex);
                    } else {
                        console.log("reached beginning of slides")
                    };
                });
            };


            //define slider functions as arguments of Slider so they can be executed using Slider(swiperInstance).function(); outside of Slider
            this.slideList = slideList;
            this.slideNext = slideNext;
            this.slidePrev = slidePrev;
            this.applyClasses = applyClasses;
            this.startSlider = startSlider;


        };
        /* END SLIDER FUNCTIONS */

        /* NAVIGATION */

        //add event listeners for navigation buttons
        prevArrow.addEventListener('click', function(){
            Slider(swiper1).slidePrev();
            Slider(swiper2).slidePrev();
        });

        nextArrow.addEventListener('click', function(){
            Slider(swiper1).slideNext();
            Slider(swiper2).slideNext();
        });

        /* BULLETS */

        //removes active class from all bullets
        function clearBullets() {
            [prev, current, next].forEach(el => el.classList.remove(...classesToRemove));
            bullets.forEach((element) =>{
                    element.classList.remove('.swiper-pagination-bullet-active');
                    console.log("bullets cleared");
            });
        };

        //sets active class for bullet of currently active slide
        function activateBullet (targetBullet){
            bullets.item(targetBullet).classList.add(".swiper-pagination-bullet-active");
            console.log("bullet activated");
        };

        //resets bullets
        function resetBullets(targetBullet) {
            clearBullets();
            activateBullet(targetBullet);
        };

        //Add event listener to each bullet to create clickable pagination functionality
        bullets.forEach((element, index) => {
            element.addEventListener("click", (event) =>{
                Slider(swiper1).slideList.item(element).scrollIntoView({
                    alignToTop: true,
                    scrollIntoViewOptions: 'smooth',
                });
                console.log("scrolled to slide");
                console.log("bullet clicked")
            });
        });


        /* INTERSECTION OBSERVERS */

        // set intersection observer options
        const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin around the viewport
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4], // Trigger when div-a is partially visible (top at or above 50vh)
        };

        // NEXT SLIDE Intersection Observer
        const observerNextSlide = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                console.log("Observing NEXT Slide: " + entry.target.getAttribute("class"))
                if (entry.intersectionRatio > 0 && entry.boundingClientRect.top <= targetScrollPosition) {
                // Advance slides functions
                Slider(swiper1).slideNext();
                Slider(swiper2).slideNext();
                //reset bullets
                resetBullets();
                console.log("slide forward")
                }
            });
        }, observerOptions);

        // Function adds elements with the class .next-slide to the Intersection Observer.
        function initializeObserverNext () {
            const elementsNextSlide = swiper1 ? swiper1.querySelectorAll('.next-slide') : [];
        
            if (elementsNextSlide.length > 0) {
                swiper1.querySelectorAll('.next-slide').forEach((element) => {
                observerNextSlide.observe(element);
                console.log("Next observer initialized for next slide")
                });
            } else {
                console.log('No elements with class ".next-slide" found.');
            };
                
        };
        
        // Create PREV Intersection Observer
        const observerPrevSlide = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                console.log("Observing PREV Slide: " + entry.target.getAttribute("class"))
                if (entry.intersectionRatio > 0 && entry.boundingClientRect.bottom >= targetScrollPosition) {
                // Regress slides functions
                Slider(swiper1).slidePrev();
                Slider(swiper2).slidePrev();
                //reset bullets
                resetBullets();
                console.log("slide back")
                }
            });
        }, observerOptions);

        // Initialize PREV observer if prev slide exists
        function initializeObserverPrev () {
            var elementsPrevSlide = swiper1 ? swiper1.querySelectorAll('.prev-slide') : [];
        
            if (elementsPrevSlide.length > 0) {
                swiper1.querySelectorAll('.prev-slide').forEach((element) => {
                observerPrevSlide.observe(element);
                console.log("PREV observer initialized for prev slide")
                });
            } else {
                console.log('No elements with class ".prev-slide" found.');
            };
                
        };
        
        //define function to init observers
        function initObservers() {
            initializeObserverNext();
            initializeObserverPrev();
        };
        
        //define function to disconnect observers
        function disconnectObservers() {
            swiper1.querySelectorAll('.next-slide').forEach(element => {
                observerNextSlide.unobserve(element);
            });
            swiper1.querySelectorAll('.prev-slide').forEach(element => {
                observerPrevSlide.unobserve(element);
            });
        }

        

        /*SLIDER INIT*/

            //init sliders
            Slider(swiper1).startSlider();
            Slider(swiper2).startSlider();
            //add locating classes to slides
            Slider(swiper1).applyClasses();
            Slider(swiper2).applyClasses();
            //add locating classes to bullets
            activateBullet(0);
            // init intersection observers
            initObservers();
    });
});
