# Changelog

# 1.1.7-test (2025-05-26)

## Meta 
 - /test/: added folder to store test configurations and an de-minified copy of swiper-bundle.min.js for reference, since Chrome DevTools seems to have issues displaying it. 

### Features
- /swiper-child/modules/customTranslate.mjs: Now uses translate3d. Refactored wrapper styling to be more efficient. 
- /swiper-child/modules/intersectionControls.mjs: 
- - When resizing in desktop mode, if swiper is out of sync with controlsSwiper, the window now scrolls to controlSwiper's active index. Useful for maintaining position/sync when resizing from mobile to desktop, or between desktop sizes where the layout shift triggers the intersection observer.
- - Added improved handling of scrolling and resizing, ensuring that any previous scrolling and resizing has finished before trying to scroll again.
- /swiper-child/utils/utils.mjs: Added back now() for use in Intersection Controls event checking. 


### Fixes
- /pages/home/home-page-js.js, /pages/projects/projects-page-js.js: 
- - Removed vanilla Swiper params settings that are set responsively in Custom Breakpoints. They don't need to be set on init, so were redundant with the responsive settings. 
- - Removed setting 'enabled' properties in custom modules. Swiper seems to default 'enabled' to true if other params are passed in for the module.
- - Fixed issue with freeMode in content swiper. The Custom Breakpoints breakpoint functions were setting Swiper.params.freeMode to 'true'/'false', instead of Swiper.params.freeMode.enabled. This was removing all the freeMode parameters and just replacing them with the single boolean value, breaking the module. 
- /swiper-child/modules/intersectionControls.mjs: Added missing 'enabled' default to extendParams(). Refactored checkBreakpoints() logic to remove repetition. Removed checkBreakpoints() call from enable(), since it is already called on resize, which automatically occurs after init. 
 
