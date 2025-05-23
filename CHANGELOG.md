# Changelog

# 1.1.2-test (2025-05-22)

### Meta
- Added '-test' to version number above. Future versions should include relevant suffixes.

### Features

- projects-page-js.js: completed rebuild of swipers. Removed unused/debud code.
- project-page-css.css: removed unused styles.
- home-page-js.js: completed rebuild of swipers. Removed unused/debud code.
- home-page-css.css: removed unused styles.
- /swiper-child/core/core.mjs: added function to update/create the 'data-hash' attribute for each slide to the zero-based index of the slide. 
- /swiper-child/modules/*: fixed incorrect 'enabled' value to check if modules were enabled. Previously every check was using the 'enabled' value from Swiper.params.moduleName.enabled rather than the Swiper.moduleName.enabled value that is initally set false in each module. Functions like 'enable' and 'disable' were modifying the value in Swiper.params, rather than the direct enabled value. Now only the 'init' event handler in each module checks Swiper.params for enabled value, then calls the 'enable' function, which will set the Swiper.moduleName.enabled to true if it is not already. All checks except those in 'init' now refer to Swiper.moduleName and do not modify the enabled value in Swiper.params. Also, removed unused/debug code. Details of each modules functionality are/will be added to the README.
