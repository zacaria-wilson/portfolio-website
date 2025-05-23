"use strict";
import { cLog, eLog } from '/global/utils/utils.js';
import SwiperChild from '../../swiper-child/core/core.mjs';
import DynamicSwiperHeight from '../../swiper-child/modules/dynamicSwiperHeight.mjs';
import CustomThumbs from '../../swiper-child/modules/customThumbs.mjs';
import CustomTranslate from '../../swiper-child/modules/customTranslate.mjs';
import CustomBreakpoints from '../../swiper-child/modules/customBreakpoints.mjs';
(() => {
  function initCSwipers(){
    window.contentSwiper = new SwiperChild('.content-swiper',
      {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 20,
        slideToClickedSlide: false,
        virtualTranslate: true,
        
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
              this.params.slidesPerView = 'auto';
              this.params.virtualTranslate = false;
              this.dynamicSwiperHeight.disable();
              this.customBreakpoints.changeClass('mobile');
              this.changeDirection('horizontal');
              this.customTranslate.disable();
            },

            991: function (){
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
      }
    );

    window.imageSwiper = new SwiperChild('.image-swiper', 
      {
        direction: "vertical",
        spaceBetween: 80, 
        mousewheel: true,
        
        customThumbs: {
          enabled: true,
          swiper: window.contentSwiper,
        },
        
        modules: [ CustomThumbs ],
      }
    );
  };

  window.onloadList.push(initCSwipers);
})();
