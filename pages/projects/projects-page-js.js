"use strict";
import SwiperChild from '../../swiper-child/core/core.mjs';
import DynamicSwiperHeight from '../../swiper-child/modules/dynamicSwiperHeight.mjs';
import CustomThumbs from '../../swiper-child/modules/customThumbs.mjs';
import CustomTranslate from '../../swiper-child/modules/customTranslate.mjs';
import CustomBreakpoints from '../../swiper-child/modules/customBreakpoints.mjs';
import IntersectionControls from '../../swiper-child/modules/intersectionControls.mjs';
(() => {
  function initCSwipers(){
    window.contentSwiper = new SwiperChild('.content-swiper',
      {
        spaceBetween: 20,
        slideToClickedSlide: false,
        freeMode: {
          momentumRatio: 0.08,
          sticky: true
        },
        
        dynamicSwiperHeight: {
          slidesPerView: 3,
        },

        customTranslate: {
          offsetStart: 1,
        },

        customBreakpoints: {
          mobileModeClass: 'mobile-mode',
          breakpoints: {
            0: function(){
              this.params.slidesPerView = 'auto';
              this.params.virtualTranslate = false;
              this.params.freeMode.enabled = true;
              this.dynamicSwiperHeight.disable();
              this.customBreakpoints.changeClass('mobile');
              this.changeDirection('horizontal');
              this.customTranslate.disable();
            },

            991: function (){
              this.params.slidesPerView = 1;
              this.params.virtualTranslate = true;
              this.params.freeMode.enabled = false;
              this.dynamicSwiperHeight.enable();
              this.customBreakpoints.changeClass('desktop');
              this.changeDirection('vertical');
              this.customTranslate.enable();
            },
          }
        },

        modules: [ DynamicSwiperHeight, CustomTranslate, CustomBreakpoints ],

        on:{
          init: function(){
            try {
                this.slides.forEach((slide, index) => {
                    const numberEl = slide.querySelector('.project-number');
                    const numberVal = index + 1;
                    if (numberVal < 10){
                        numberEl.textContent = '0' + numberVal.toString() + '.';
                    } else {
                        numberEl.textContent = numberVal.toString() + '.';
                    }
                });
            } catch (err) {
                console.error('CustomBullets failed:', err);
            }
          }
        },
      }
    );

    window.imageSwiper = new SwiperChild('.image-swiper', 
      {
        direction: "vertical",
        spaceBetween: 80, 
        slidesPerView: 'auto',
        
        customThumbs: {
          swiper: window.contentSwiper,
          invert: true,
        },

        intersectionControls: {
          thumbsScroll: true,
          transitionPoint: window.innerHeight * 0.7,
          observerOptions:{
            threshold: 'auto'
          }
        },
        
        customBreakpoints:{
          breakpoints: {
            0: function(){
              console.log('ImageSwiper: breakpoint 0');
              this.intersectionControls.disable();
              this.customThumbs.disable();
            },

            991: function (){
              console.log('ImageSwiper: breakpoint 991');
              this.customThumbs.enable()
              this.intersectionControls.enable();
            },
          },
        },
        
        modules: [ CustomThumbs, IntersectionControls, CustomBreakpoints ],
    
      }
    );
  };
  window.onloadList.push(initCSwipers);
})();