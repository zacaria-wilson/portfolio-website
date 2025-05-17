import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

export default function CustomBreakpoints({ swiper, extendParams, on, emit }){
    extendParams({
        customBreakpoints: {
            enabled: false,
            mobileModeClass: null,
            breakpoints: {},
        },
    });

    swiper.customBreakpoints = {
        enabled: false,
    };

    let mobileClass;
    let breakpointsKeys = [];
    let sortedBreakpoints = [];
    
    function checkBreakpoint(){
        let windowWidth = window.innerWidth
        cLog('checkBreakpoint windowWidth', windowWidth);
        /*
        let prev;
        let next;
        if (swiper.currentBreakpoint <= 1) {
            prev = undefined
        } else prev = breakpointsKeys.at(breakpointsKeys.indexOf(swiper.currentBreakpoint) - 1);
        next = breakpointsKeys.at(breakpointsKeys.indexOf(swiper.currentBreakpoint) + 1);

        cLog('CustomBreakpoints: checkBreakpoints prev =', prev, ' next = ', next, 'windowWidth', windowWidth);
        cLog('breakpointsKeys index of current breakpoint = ', breakpointsKeys.indexOf(swiper.currentBreakpoint))
        
        if (!prev && windowWidth <= next){
            swiper.currentBreakpoint = 1 ;
            sortedBreakpoints[1]();
            return true;
        } else if (prev && windowWidth <= swiper.currentBreakpoint){
            cLog('CustomBreakpoints: checkBreakpoint PREV')
            swiper.currentBreakpoint = prev;
            sortedBreakpoints[prev]();
            return true;
        } else if (next && windowWidth >= next){
            cLog('CustomBreakpoints: checkBreakpoint NEXT')
            swiper.currentBreakpoint = next;
            sortedBreakpoints[next]();
            return true;
        } else return false;
        */

        for (let i = 0; i < breakpointsKeys.length; i++){
            if (windowWidth >= breakpointsKeys[i]){
                let next = breakpointsKeys[i + 1];
                if (next && windowWidth <= next){
                    cLog('checkBreakpoint: breakpointsKeys[i] = ', breakpointsKeys[i], 'next = ', next);
                    swiper.currentBreakpoint = breakpointsKeys[i];
                    sortedBreakpoints[i].functions();
                    return true;
                } else if (!next && swiper.currentBreakpoint !== breakpointsKeys[i]) {
                    cLog('checkBreakpoint: breakpointsKeys[i] = ', breakpointsKeys[i], 'next = ', next);
                    swiper.currentBreakpoint = breakpointsKeys[i];
                    sortedBreakpoints[i].functions();
                    return true;
                }
            } 
        };
        
        return false;

    };




    function changeClass(mode) {
        cLog("CustomBreakpoints: changeClass mode =", mode)
        let swiperClasses = swiper.el.classList
        if (mode === 'mobile'){
            if (!swiperClasses.contains(mobileClass)){
                swiperClasses.add(mobileClass);
                return true;
            } else return false;
        } else if (mode === 'desktop'){
            if (swiperClasses.contains(mobileClass)){
                swiperClasses.remove(mobileClass);
                return true;
            } else return false;
        } else return false;
    };

    function init(){
        if (!swiper.params.customBreakpoints.enabled) return false;
        for (const key in swiper.params.customBreakpoints.breakpoints){
            breakpointsKeys.push(parseInt(key))
        };
        if (breakpointsKeys.length > 1){
            breakpointsKeys.sort()
            for (let i = 0; i < breakpointsKeys.length; i++){
                sortedBreakpoints.push({'functions': swiper.params.customBreakpoints.breakpoints[breakpointsKeys[i]].bind(swiper)});
            };
        };
        swiper.currentBreakpoint = 0;
        mobileClass = swiper.params.customBreakpoints.mobileModeClass;
        cLog('CustomBreakpoints: init() breakpointsKeys = ', breakpointsKeys, ' sortebBreakpoints = ', sortedBreakpoints, ' swiper.currentBreakpoint = ', swiper.currentBreakpoint)
        //checkBreakpoint();
    };

    function enable(){
        if (swiper.params.customBreakpoints.enabled) return false;
        swiper.params.customBreakpoints.enabled = true;
        cLog('customBreakpoints: enabled');
        return true;
    };

    function disable(){
        cLog('customBreakpoints: disabled');
        if (!swiper.params.customBreakpoints.enabled) return false;
        swiper.params.customBreakpoints.enabled = false;
        return true;
    };
    
    on('resize', () => {
        cLog('resize')
        if (swiper.params.customBreakpoints.enabled) {
            if (checkBreakpoint()){
                cLog('CustomBreakpoint: new breakpoint', swiper.currentBreakpoint);
            } else {
                cLog('CustomBreakpoint: breakpoint unchanged', swiper.currentBreakpoint)
            }
        };
    });

    on('init', () => {
        if (swiper.params.customBreakpoints.enabled) {
            cLog('customBreakpoints: init');
            enable();
            init();
        };
    });

    on('destroy', () => {
        if (swiper.params.customBreakpoints.enabled) {
            disable();
        };
    });


    Object.assign(swiper.customBreakpoints, {
        enable,
        disable,
        changeClass,
    });
}



