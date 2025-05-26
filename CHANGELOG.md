# Changelog

# 1.1.9-test (2025-05-26)

### Features
- /swiper-child/modules/customThumbs.mjs: Added support for swiping on thumbs swipers. When Custom Thumbs is enabled, thumbs swiper 'slideChange' event now also emits 'thumbsSlideChange' event. 

### Fixes
- /swiper-child/modules/intersectionControls.mjs: Modified thumbs handling for 
'scroll' to use the new 'thumbsSlideChange' event from Custom Thumbs. Consequently, scrolling through swiper triggers scrollTo(), scrolling to top of slide. May add functionality to make that optional in the future (see TODO). 
 
