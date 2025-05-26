"use strict";
import SwiperChild from '../../swiper-child/core/core.mjs';
(() => {
    function initTestSwipers(){
    window.testSwiper = new SwiperChild(".test-swiper-container", {
        slidesPerView: "auto",
        spaceBetween: 20,
        freeMode: true,
        slideClass: 'test-swiper-slide',
        wrapperClass: 'test-swiper-wrapper',
        onAny: function (name, ...args) {
        //console.log("Event", name);
        //console.log("this.touchEventsData.velocities", this.touchEventsData.velocities);
        //console.log('data', ...args)
        },
    });
    };
    window.onloadList.push(initTestSwipers);
})();
