# Zacaria Wilson Portfolio Website

>[!WARNING] 
>This project and the code within it is not intended for public use. Please do not use it for any purposes. See [DISCLAIMER](DISCLAIMER.md) for more information.
--- 

### Site Link: [zacariawilson.com](https://www.zacariawilson.com)
---

### Description:
This repo contains resources for my portfolio site, mostly JavaScript and CSS. 
The site is built with [Webflow](https://github.com/webflow), and the code is implemented using on-page HTML script tags with [JSDelivr](https://github.com/jsdelivr/jsdelivr) links, inserted with Webflow's custom header/body code features. 

This projects makes significant use of [Swiper.js](https://github.com/nolimits4web/swiper) both directly and as model for adaptation. Currently you can see the swipers in action on the Home page and Projects page. See the Swiper section below for attribution and more information about how they work.

### Project Structure
The resources for a particular page can be found under /pages/page-name/, where "page-name" is the slug of the page URL (e.g. pages/projects/ contains code for the page at zacariawilson.com/projects). Site-wide (on every page) resources can be found under /global/. Code related to my Swiper adaptation is under /swiper-child.

### Swiper
A significant part of this project is a customized implementation of Swiper.js that adds functionality I was unable to find in current available versions. My solution was to use Swiper's core functions to handle most of the basic swiper functionality and add what I need with adapted methods and modules. I chose to use Swiper because it was easier and more reliable than writing a new slider program myself. Additionally, Swiper's module and event handling systems are very flexible, making it easy to add my own. My modules are based on the Swiper's modules, using their format but with my own functions. Many thanks to [Vladimir Kharlampidi](https://github.com/nolimits4web) and the Swiper.js community for their amazing project.


### Modules
All modules must be imported and passed into the 'modules' parameter at Swiper initialization. 
<pre><code>const swiper = new Swiper('.swiper', { 
    modules: [ CustomTranslate ],
    customTranslate: {
        enabled: true,
        offsetStart: 2
    }
});  
</code></pre>

---

#### Custom Breakpoints
This module allows for breakpoints and associated functions to be passed into Swiper constructor parameters. Functions are executed when the window width crosses that breakpoint, with breakpoint 0 as the lowest. This allows for greater customization of responsive behavior, although that comes without the safeguards of Swiper's breakpoints feature that prevent layout-breaking changes.

##### Custom Breakpoints Parameters
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Types</th>
        <th>Default</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>enabled</td>
        <td>boolean</td>
        <td>false</td>
        <td></td>
    </tr>
    <tr>
        <td>mobileModeClass</td>
        <td>string</td>
        <td>false</td>
        <td>A class to be added/removed from the Swiper.el element using the Swiper.customBreakpoints.changeClass method. Useful for applying responsive CSS styles. Media queries can provide similar functionality; however, this feature is also useful for manually toggling between mobile and desktop views with the <code>changeClass()</code> method.</td>
    </tr>
    <tr>
        <td>breakpoints</td>
        <td>object { number: function }</td>
        <td>false</td>
        <td>An object with breakpoints and their corresponding functions. Each breakpoint will apply to all window sizes above it, unless there is a larger breakpoint. Breakpoint 0 should be used to pass a function for all sizes below the next smallest breakpoint (i.e. mobile mode).<br><br>
        <pre><code>const swiper = new Swiper('.swiper', { 
        customBreakpoints: {enabled: true,
            mobileModeClass: 'mobile-mode',
            breakpoints: {
                0: function(){
                    //Responsive behavior for screens 
                    //size 0px to 991px (next breakpoint).
                },
                991: function(){
                    //Responsive behavior for screens 
                    //size 991px and above.
                }
            }
        },
        modules: [ CustomBreakpoints ],
});
</code></pre> 
        </td>
    </tr>
</table>

##### Custom Breakpoints Methods
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Arguments</th>
        <th>Default Argument</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>swiper.customBreakpoints.changeClass(mode)</td>
        <td>'mobile' | 'desktop'</td>
        <td></td>
        <td>Adds or removes the class passed in for mobileModeClass to the swiper container element.</td>
    </tr>
    <tr>
        <td>swiper.customBreakpoints.enable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>swiper.customBreakpoints.disable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
</table>

---

#### Custom Thumbs
This module links two Swipers, much like Swiper's own 'thumbs' module, but allows for inverting the direction of control while still capturing click events on the thumbs Swiper. This is useful in combination with the `Intersection Controls` module, which can be configured such that event clicks on the thumbs Swiper will scroll the window to the corresponding slide of the main Swiper, while scrolling through the main swiper will advance the thumb swiper.

##### Custom Thumbs Parameters
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Types</th>
        <th>Default</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>enabled</td>
        <td>boolean</td>
        <td>false</td>
        <td></td>
    </tr>
    <tr>
        <td>swiper</td>
        <td>object</td>
        <td>null</td>
        <td>Swiper instance used as thumbs.</td>
    </tr>
    <tr>
        <td>invert</td>
        <td>boolean</td>
        <td>false</td>
        <td>When enabled, thumb clicks will progress the thumbs swiper, rather than the main swiper. Useful for customizing main swiper behavior, using the 'thumbClick' event with Swiper's 'on' parameter.</td>
    </tr>
</table>

##### Custom Thumbs Methods
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Arguments</th>
        <th>Default Argument</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>swiper.customThumbs.enable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>swiper.customThumbs.disable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
</table>

##### Custom Thumbs Events
<table>
    <tr><thead>
        <th>Name</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>thumbClick</td>
        <td>Emitted by main swiper on thumb click.</td>
    </tr>
</table>

---

#### Custom Translate
This module allows for swiper wrapper translation on swiper progress that accommodates slide dimensions varying between active and inactive states. The translation value is based on the inactive slide's relevant dimension (width or height, depending on whether `Swiper.params.direction` is `'vertical'` or `'horizontal'`). All inactive slides are assumed to have the same relevant dimension. 3D translations are not supported. `Swiper.params.virtualTranslate` must be set to `'true'` for this module to work properly, since it overrides the wrappers translate styles.

##### Custom Translate Parameters
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Types</th>
        <th>Default</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>enabled</td>
        <td>boolean</td>
        <td>false</td>
        <td></td>
    </tr>
    <tr>
        <td>offsetStart</td>
        <td>number</td>
        <td></td>
        <td>The index of the slide at which to start translating the wrapper. Translation of the swiper wrapper will be offset by this number of slides, from the start. Useful for keeping additional previous slides visible until the swiper progresses past a defined index. In combination with the <code>Dynamic Swiper Height</code> module to ensure the swiper container is sized correctly.</td>
    </tr>
</table>

##### Custom Translate Methods
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Arguments</th>
        <th>Default Argument</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>swiper.customTranslate.enable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>swiper.customTranslate.disable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
</table>

---

#### Dynamic Swiper Height
Resizes the swiper container to fit a specified number of slides, allowing for dimension differences between active and inactive slides. All inactive slides are assumed to have the same relevant dimension (width or height, depending on whether `Swiper.params.direction` is `'vertical'` or `'horizontal'`). 

##### Dynamic Swiper Height Parameters
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Types</th>
        <th>Default</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>enabled</td>
        <td>boolean</td>
        <td>false</td>
        <td></td>
    </tr>
    <tr>
        <td>slidesPerView</td>
        <td>number</td>
        <td></td>
        <td>The number of slides to show within the swiper container.</td>
    </tr>
</table>

##### Dynamic Swiper Height Methods
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Arguments</th>
        <th>Default Argument</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>swiper.dynamicSwiperHeight.enable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>swiper.dynamicSwiperHeight.disable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
</table>

---

#### Intersection Controls
Uses the `Intersection Observer` API to determine swiper progress based on slide position within the IntersectionObserver ` root ` element. Intended be used in combination with `Custom Thumbs` for controlling the thumb swiper by scrolling through slides. Note that `slidesPerView` must be set to `'auto'` for this to work, so that all slides are included in the swiper container and can be scrolled through. However, Swiper automatically disables progress when  `slidesPerView` is set to `'auto'`. As a result, using this module without `Custom Thumbs` enabled and `Swiper.params.customThumbs.invert` set to `true` will not have the desired effect. Future updates to this project may expand functionality for this module if the same effect can be achieved without using `slidesPerView: 'auto'` or if swiper progress can be re-enabled. 
<pre><code>
const swiper1 new Swiper(.swiper-1)
const swiper2 = new Swiper('.swiper-2', { 
    direction:'vertical',
    slidesPerView: 'auto',
    modules : [ CustomThumbs, IntersectionControls ],

    customThumbs: {
        enabled: true,
        swiper: swiper1,
        invert:true
    },

    intersectionControls: {
        enabled: true,
        thumbScroll: true,
        transitionPoint: window.innerHeight * 0.7,
    }
});
</code></pre>

##### Intersection Controls Parameters
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Types</th>
        <th>Default</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>enabled</td>
        <td>boolean</td>
        <td>false</td>
        <td></td>
    </tr>
    <tr>
        <td>scroll</td>
        <td>boolean</td>
        <td>false</td>
        <td>When enabled and the swiper has <code>Custom Thumbs</code> enabled, with <code>invert</code> set to true, thumbs clicks will scroll the window to the top of the slide corresponding to the index of the clicked thumbs slide.</td>
    </tr>
    <tr>
        <td>transitionPoint</td>
        <td>number</td>
        <td></td>
        <td>The vertical position in the viewport that slides must scroll past to progress the swiper. Technically, this can accept any number value, and so could refer to a vertical position relative to an <code>IntersectionObserver.root</code> element other than the viewport window. However, this module uses <code>IntersectionObserverEntry.boundingClientRect.top</code> and <code>IntersectionObserverEntry.boundingClientRect.bottom</code> to check the slides positions, so the viewport position would need to be accounted for.
        </td>
    </tr>
    <tr>
        <td>observerOptions</td>
        <td>object { root: element, rootMargin: string, threshold: number | [number] | 'auto'}</td>
        <td>false</td>
        <td>Options for the <code>IntersectionObserver</code> constructor. Works the same as those described in the MDN Web Docs page for <a href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver">IntersectionObserver:IntersectionObserver() constructor</a>, except for threshold, which accepts the string <code>'auto'</code> as an additional argument. If <code>'auto'</code> is passed in, or if no value is passed in, the <code>threshold</code> value will be an array of numbers from 0.01 to 1, at intervals of 0.01 (i.e. [ 0.01, 0.02, 0.03, ...1]). 
        </td>
    </tr>
</table>

##### Intersection Controls Methods
<table>
    <tr><thead>
        <th>Name</th>
        <th>Accepted Arguments</th>
        <th>Default Argument</th>
        <th>Description</th>
    </tr></thead>
    <tr>
        <td>swiper.intersectionControls.scrollTo(index)</td>
        <td>number</td>
        <td></td>
        <td>Scrolls the window to the top of the slide at <code>Swiper.slides[index]</code>.</td>
    </tr>
    <tr>
        <td>swiper.intersectionControls.enable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>swiper.intersectionControls.disable()</td>
        <td>none</td>
        <td></td>
        <td></td>
    </tr>
</table>