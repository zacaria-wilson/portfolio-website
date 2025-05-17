"use strict";
import { cLog, eLog } from '../../global/utils/utils.js';
import SwiperChild from '../../swiper-child/core/core.mjs';
import DynamicSwiperHeight from '../../swiper-child/modules/dynamicSwiperHeight.mjs';
import CustomThumbs from '../../swiper-child/modules/customThumbs.mjs';
import CustomTranslate from '../../swiper-child/modules/customTranslate.mjs';
import CustomBreakpoints from '../../swiper-child/modules/customBreakpoints.mjs';
import IntersectionControls from '../../swiper-child/modules/intersectionControls.mjs';
(() => {
  function initCSwipers(){
    window.contentSwiper = new SwiperChild('.content-slider',
      {
        name: 'content-swiper',
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 20,
        slideToClickedSlide: false,
        virtualTranslate: true,
        //speed: 1000,
        
        dynamicSwiperHeight: {
          enabled: true,
          slidesPerView: 3,
        },

        customTranslate: {
          enabled: true,
          offsetStart: 1,
        },

        customBreakpoints: {
          enabled: true,
          mobileModeClass: 'mobile-mode',
          breakpoints: {
            0: function(){
              cLog('Breakpoint 0')
              this.params.slidesPerView = 'auto';
              this.params.virtualTranslate = false;
              this.dynamicSwiperHeight.disable();
              this.customBreakpoints.changeClass('mobile');
              this.changeDirection('horizontal');
              this.customTranslate.disable();
            },

            991: function (){
              cLog('Breakpoint 991')
              this.params.slidesPerView = 1;
              this.params.virtualTranslate = true;
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

        onAny(event, eventData){
          //cLog('Event:', event);
          //cLog('Event Data:', eventData);
        }
        
      }
    );

    window.imageSwiper = new SwiperChild('.image-slider', 
      {
        direction: "vertical",
    
        spaceBetween: 80, 

        //freemode: true,

        slidesPerView: 'auto',

        //virtualTranslate: true,

        //cssMode: true,

        //setWrapperSize: true,

        //autoHeight: true,
        
        customThumbs: {
          enabled: true,
          swiper: window.contentSwiper,
          invert: true,
        },

        intersectionControls: {
          enabled: true,
          thumbsScroll: true,
          transitionPoint: window.innerHeight * 0.7,
          observerOptions:{
            threshold: 'auto'
          }
        },

        breakpoints: {
          enabled: true,
          0: function(){
            cLog('Breakpoint 0')
            this.intersectionControls.disable();
            this.customThumbs.disable();
          },

          991: function (){
            cLog('Breakpoint 991')
            this.customThumbs.enable()
            this.intersectionControls.enable();
          },
        },
        
        modules: [ CustomThumbs, IntersectionControls, CustomBreakpoints ],
    
      }
    );
  };

  window.onloadList.push(initCSwipers);

})();