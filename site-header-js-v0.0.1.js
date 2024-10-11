"use strict";
(() => {
    window.onloadList = []; 

    function globalHeaderFunctions(){
        let metaEl = document.querySelector('[name ="viewport"]');
        metaEl.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1');

        let copyEmailButtons = document.querySelectorAll('.copy-email');
        copyEmailButtons.forEach(el =>{
            el.addEventListener('click', (e)=>{
                console.log('el is', el)
                navigator.clipboard.writeText('zacaria.b.wilson@gmail.com');
                el.innerText = 'Copied'
                setTimeout(()=>{
                    el.innerText = 'Copy'
                }, 1000)
            })
        })

        window.scrollToTop = ()=>{
            window.scrollTo({top:0, behavior:'smooth'})
        }
    }; 

    //Push this function to onload list
    onloadList.push(globalHeaderFunctions)

    function executeOnload(){

        for (let i = 0; i< onloadList.length; i++){
            onloadList[i]();
        };
    };


    if (window.addEventListener){window.addEventListener("load", executeOnload, false)}
    else if (window.attachEvent){window.attachEvent("load", executeOnload)}
    else {window.onload = executeOnload()}


})();

