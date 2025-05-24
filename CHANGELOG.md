# Changelog

# 1.1.4-test (2025-05-23)

### Meta 
- Resources from this repo will now be implemented on the Webflow site using code block elements in hidden CMS collection elements at the bottom of each page body, rather than in the "custom header code" section for each page. This provides several benefits:
- - URLs linking to the resources can be generated dynamically, using text from CMS  fields. This allows for the section of the URL containing the JSDelivr path to the GitHub repo and version to be dynamically generated. As a result, switching between different versions can be done by modifying a single CMS item, rather than manually modifying the path of every url.
- - This also allows for separating Staging and Production code, by simply modifying a component property value between 'STG' and 'PRD'. That does still require modifying the value on each page; however, it is much easier than modifying the URL string of each linked resource. And since Webflow does not support publishing CMS item changes to Staging and Production separately, nor using page URLs in CMS collection filtering, this seems like the most efficient way currently available.
- /global/site-header-css.css: renamed to global-css.css.
- /global/site-header-js.js: renamed to global-css.css.


