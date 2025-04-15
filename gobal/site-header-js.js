"use strict";
(() => {
    //Array of functions to execute onload. Scoped for access from other scripts.
    window.onloadList = []; 

    function siteOnLoad(){

        document.querySelector('[name ="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1');

        const copyEmailButtons = document.querySelectorAll('.copy-email');
        copyEmailButtons.forEach(el => {
            el.addEventListener('click', (e) => {
                console.log('Copy Email Button Clicked: ', el)
                navigator.clipboard.writeText('zacaria.b.wilson@gmail.com');
                el.innerText = 'Copied'
                setTimeout(()=>{
                    el.innerText = 'Copy'
                }, 1000)
            })
        })

        window.scrollToTop = () => {
            window.scrollTo({top:0, behavior:'smooth'})
        }
    }; 

    //Push this function to onloadList
    onloadList.push(siteOnLoad);

    //Executes all functions in onloadList
    function executeOnLoad(){

        for (let i = 0; i< onloadList.length; i++){
            onloadList[i]();
        };
    };


    if (window.addEventListener){window.addEventListener("load", executeOnLoad, false)}
    else if (window.attachEvent){window.attachEvent("load", executeOnLoad)}
    else {window.onload = executeOnLoad()}


})();

