$(document).ready(function () {

    $(".slider-main_component").each(function (index) {
        
        const swiper1 = document.querySelector('.image-swiper');
        const swiper2 = document.querySelector('.content-swiper');
        let targetScrollPosition = window.innerHeight * 0.4;
        const bullets = document.querySelectorAll('.swiper-pagination-bullet');
        const prevArrow = document.querySelector('.swiper-prev');
        const nextArrow = document.querySelector('.swiper-next');

        
        function Slider(sliderInstance) {

            this.sliderInstance = sliderInstance;

            const swiperWrapper = sliderInstance.querySelector('.swiper-wrapper');
            const slideList = swiperWrapper.querySelectorAll(".swiper-slide");
            const slidesArray = Array.from(slideList);
            let current;
            let prev;
            let next;
            let targetSlideIndex;
            
            function updateSwiperWrapperHeight() {
                if (sliderInstance == swiper2) {
                    const activeSlideHeight = slideList.item(current).offsetHeight;
                    swiperWrapper.style.height = `${activeSlideHeight}px`;
                }
            }

            function resetSwiperWrapperHeight() {
                if (sliderInstance == swiper2) {
                    swiperWrapper.style.height = '100px';
                    console.log("reset wrapper height");
                }
            }

            function startSlider() {
                current = swiperWrapper.querySelector('.active-slide') || swiperWrapper.firstElementChild;
                prev = current.previousElementSibling;
                next = current.nextElementSibling;

            };

            function applyClasses() {
                if (sliderInstance == swiper2) {
                    slideList.forEach((el) => {
                        el.style.opacity = "0";
                        el.style.transform = "translate(0, 100%)";
                        el.style.transition = "opacity 0s ease-in-out, transform 0s ease-in-out";
                    });
                }

                if (current) {
                    current.classList.add('active-slide');
                    if (sliderInstance == swiper2) {
                        current.style.opacity = "1";
                        current.style.transform = "translate(0,0)";
                        current.style.transition = "opacity .5s ease-in-out, transform .5s ease-in-out";
                    }
                } else {
                    console.log("no current slide???");
                }
                
                if (prev) {
                    prev.classList.add('prev-slide');
                    
                } else {
                    console.log("no prev to apply classes");
                }
                
                if (next) {
                    next.classList.add('next-slide');
                } else {
                    console.log("no next to apply classes");
                }
                
            }
        
            function slideChange (targetSlideIndex){

                if(sliderInstance == swiper1){
                    disconnectObservers();
                };

                const classesToRemove = ['active-slide', 'prev-slide', 'next-slide'];

                [prev, current, next].forEach((el, index) => {el ? el.classList.remove(...classesToRemove): console.log("could not remove classes from ", index)});
                
                prev = slideList.item(targetSlideIndex - 1);
                current = slideList.item(targetSlideIndex);
                next = slideList.item(targetSlideIndex + 1);
                
                applyClasses();
                
                if ((sliderInstance == swiper2) && prev) {
                    prev.style.opacity = "0";
                    prev.style.transform = "translate(0,-100%)";
                    prev.style.transition = "opacity .5s ease-in-out, transform .5s ease-in-out";
                }
                if ((sliderInstance == swiper2) && next) {
                    next.style.opacity = "0";
                    next.style.transform = "translate(0,100%)";
                    next.style.transition = "opacity .5s ease-in-out, transform .5s ease-in-out";
                }

                if(sliderInstance == swiper1){
                    initObservers();
                };

                resetBullets(targetSlideIndex);
            };
            
            function slideNext() {
                let targetSlideIndex = -1;
            
                console.log(sliderInstance.getAttribute("class"), " slideNext. slideList is: ", slideList);
            
                slidesArray.some((element, index) => {
                    if (element === next) {
                        targetSlideIndex = index;
                        slideChange(targetSlideIndex);
                        return true; 
                    }
                    return false;
                });
            
                if (targetSlideIndex === -1) {
                    console.log(sliderInstance.getAttribute("class"), " slideNext reached end of slides");
                }
            }
            
            function slidePrev() {
                let targetSlideIndex = -1;
            
                console.log(sliderInstance.getAttribute("class"), " slidePrev. slideList is: ", slideList);
                
                slidesArray.some((element, index) => {
                    if (element === prev) {
                        targetSlideIndex = index;
                        slideChange(targetSlideIndex);
                        return true;
                    }
                    return false;
                });
            
                if (targetSlideIndex === -1) {
                    console.log(sliderInstance.getAttribute("class")," slidePrev reached beginning of slides");
                }
            }
            
            this.getPrevSlide = function () {
                if (prev){return prev;};
            };

            this.getNextSlide = function () {
                if (next){return next;};
            };

            this.slideList = slideList;
            this.slidesArray = slidesArray;
            this.slideNext = slideNext;
            this.slidePrev = slidePrev;
            this.applyClasses = applyClasses;
            this.startSlider = startSlider;
            this.updateSwiperWrapperHeight = updateSwiperWrapperHeight;
            this.resetSwiperWrapperHeight = resetSwiperWrapperHeight;


        };
        
        const imageSlider = new Slider(swiper1);
        const contentSlider = new Slider(swiper2);
        const unfoldButtonList = swiper2.querySelectorAll('.unfold-button');
        const projectDescList = swiper2.querySelectorAll('.project-desc');

        function descUnfold() {
            projectDescList.forEach((el) =>{
                el.style.opacity = "1";
                el.style.transition = "opacity 0.5s ease-in-out"
                contentSlider.updateSwiperWrapperHeight();
            });
        };

        function descFold() {
            projectDescList.forEach((el) =>{
                el.style.opacity = "0";
                contentSlider.resetSwiperWrapperHeight();
            });
        };

        unfoldButtonList.forEach((element)=>{
            element.addEventListener('click', function() {
                if (element.getAttribute("class") == "unfold-button open"){
                    descFold();
                    element.classList.remove("open");
                    element.classList.add("closed");
                } else if (element.getAttribute("class") == "unfold-button closed"){
                    descUnfold();
                    element.classList.remove("closed");
                    element.classList.add("open");
                };
            });
        });

        prevArrow.addEventListener('click', function() {
            const prevSlide = imageSlider.getPrevSlide();
            if (prevSlide) {
                prevSlide.scrollIntoView({ behavior: "smooth", block: "start" });
                console.log('prevArrow');
            } else {
                console.log("no prevArrow");
            }
        });
        
        nextArrow.addEventListener('click', function() {
            const nextSlide = imageSlider.getNextSlide();
            if (nextSlide) {
                nextSlide.scrollIntoView({ behavior: "smooth", block: "start" });
                console.log('nextArrow');
            } else {
                console.log("no nextArrow");
            }
        });
        
        function clearBullets() {
            bullets.forEach((element) =>{
                    element.classList.remove('swiper-pagination-bullet-active');
                    console.log("bullets cleared");
            });
        };

        function activateBullet (targetBullet){
            bullets.item(targetBullet).classList.add("swiper-pagination-bullet-active");
            console.log("bullet activated");
        };

        function resetBullets (targetBullet) {
            this.targetBullet = targetBullet;
            clearBullets();
            activateBullet(targetBullet);
        };

        bullets.forEach((element, index) => {
            element.addEventListener("click", function() {
                imageSlider.slideList.item(index).scrollIntoView({ behavior: "smooth", block: "start" });
                console.log("bullet clicked: ", index);
                
            });
        });

        const observerOptions = {
        root: null,
        rootMargin: '0px', 
        threshold: [0, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95],
        };

        const observerNextSlide = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry,index) => {
                // Convert the NodeList to an array
                const slidesArray = Array.from(imageSlider.slideList);

                // Find the index of the target slide
                const slideIndex = slidesArray.indexOf(entry.target);
                //log slide being observed
                console.log("Observing NEXT Slide: " + slideIndex, "at: ", entry.boundingClientRect.top);

                if (entry.intersectionRatio > 0 && entry.boundingClientRect.top <= targetScrollPosition) {
                // Advance slides functions
                imageSlider.slideNext();
                contentSlider.slideNext();
                
                console.log("observerNextSlide")
                }
            });
        }, observerOptions);

        function initializeObserverNext () {
            const elementsNextSlide = swiper1 ? swiper1.querySelectorAll('.next-slide') : [];
        
            if (elementsNextSlide.length > 0) {
                swiper1.querySelectorAll('.next-slide').forEach((element) => {
                observerNextSlide.observe(element);
                console.log("ObserverNext observing: ", element)
                });
            };
                
        };
        
        const observerPrevSlide = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                const slidesArray = Array.from(imageSlider.slideList);
                const slideIndex = slidesArray.indexOf(entry.target);

                if (entry.intersectionRatio > 0 && entry.boundingClientRect.bottom >= targetScrollPosition) {
                    imageSlider.slidePrev();
                    contentSlider.slidePrev();
                };
            });
        }, observerOptions);

        function initializeObserverPrev () {
            var elementsPrevSlide = swiper1 ? swiper1.querySelectorAll('.prev-slide') : [];
        
            if (elementsPrevSlide.length > 0) {
                swiper1.querySelectorAll('.prev-slide').forEach((element) => {
                observerPrevSlide.observe(element);
                console.log("ObserverPrev observing: ", element)
                });
            };   
        };
        
        function initObservers() {
            initializeObserverNext();
            initializeObserverPrev();
        };
        
        function disconnectObservers() {
            console.log("disconnectObservers")
            swiper1.querySelectorAll('.next-slide').forEach(element => {
                observerNextSlide.unobserve(element);
                console.log("unobserve next: ", element)
            });
            swiper1.querySelectorAll('.prev-slide').forEach(element => {
                observerPrevSlide.unobserve(element);
                console.log("unobserve prev: ", element)
            });
        };

        imageSlider.startSlider();
        contentSlider.startSlider();
        imageSlider.applyClasses();
        contentSlider.applyClasses();
        resetBullets();
        initObservers();

    });
});