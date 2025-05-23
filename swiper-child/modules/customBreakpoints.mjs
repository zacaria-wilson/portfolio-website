import { cLog, eLog, now } from "../swiper-utils/utils.mjs";

export default function CustomBreakpoints({ swiper, extendParams, on, emit }){
    extendParams({
        customBreakpoints: {
            mobileModeClass: null,
            breakpoints: {},
        },
    });

    swiper.customBreakpoints = {
        enabled: false,
    };

    let initialized = false;
    let mobileClass;
    let breakpointsKeys = [];
    let sortedBreakpoints = [];
    
    function checkBreakpoint(){
        let windowWidth = window.innerWidth
        for (let i = 0; i < breakpointsKeys.length; i++){
            if (windowWidth >= breakpointsKeys[i]){
                let next = breakpointsKeys[i + 1];
                if (next && windowWidth <= next){
                    swiper.currentBreakpoint = breakpointsKeys[i];
                    sortedBreakpoints[i].functions();
                    return true;
                } else if (!next && swiper.currentBreakpoint !== breakpointsKeys[i]) {
                    swiper.currentBreakpoint = breakpointsKeys[i];
                    sortedBreakpoints[i].functions();
                    return true;
                }
            } 
        };
        return false;
    };

    function changeClass(mode) {
        if (typeof swiper.params.customBreakpoints.mobileClass !== 'string') return false;
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

    function arrayBreakpoints(){
        for (const key in swiper.params.customBreakpoints.breakpoints){
            if (typeof parseInt(key) !== 'number'){
                eLog('CustomBreakpoints: Improper key type passed in for breakpoints. Swiper.params.customBreakpoints.breakpoints requires an object where all keys are numbers.')
                return false;
            }
            if (typeof swiper.params.customBreakpoints.breakpoints[key] !== 'function'){
                eLog('CustomBreakpoints: Improper value type passed in for breakpoints. Swiper.params.customBreakpoints.breakpoints requires an object where all values are functions.')
                return false;
            }
            breakpointsKeys.push(parseInt(key))
        };
        return true;
    }

    function init(){
        if (initialized) return false;
        if (!arrayBreakpoints()) {
            swiper.disable();
            return false;
        }
        if (breakpointsKeys.length > 1){
            breakpointsKeys.sort()
            for (let i = 0; i < breakpointsKeys.length; i++){
                sortedBreakpoints.push({'functions': swiper.params.customBreakpoints.breakpoints[breakpointsKeys[i]].bind(swiper)});
            };
        };
        swiper.currentBreakpoint = 0;
        mobileClass = swiper.params.customBreakpoints.mobileModeClass;
        initialized = true;
        return true;
    };

    function enable(){
        if (swiper.customBreakpoints.enabled) return false;
        checkBreakpoint();
        swiper.customBreakpoints.enabled = true;
        return true;
    };

    function disable(){
        if (!swiper.customBreakpoints.enabled) return false;
        swiper.customBreakpoints.enabled = false;
        return true;
    };
    
    on('resize', () => {
        if (swiper.customBreakpoints.enabled) {
            checkBreakpoint();
        };
    });

    on('init', () => {
        if (swiper.params.customBreakpoints.enabled) {
            enable();
            init();
        };
    });

    on('destroy', () => {
        if (swiper.customBreakpoints.enabled) {
            disable();
        };
    });


    Object.assign(swiper.customBreakpoints, {
        enable,
        disable,
        changeClass,
    });
}



