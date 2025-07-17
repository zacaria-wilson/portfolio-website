# Changelog

# 1.1.11 (2025-07-17)

### Features
- /global/global-css.css: Added animation for slide-up effect. In use on home page. 
- 
### Fixes
- /pages/projects/projects-page-css.css: Removed .swiper-slide height styles causing layout breaking on large displays and updated height styles in Webflow. 
 
### Notes
- Found cause of the .sidebar-content element's sticky positioning failing on Projects page. The .slider-container grid-template-rows style was set to 100% instead of 1fr, causing the parent of .sidebar-content to not extend the full height of .slider-container, thus preventing .sidebar-content from sticky scrolling. 