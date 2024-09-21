"use strict";
(() => {
    window.onloadList = []; 

    function globalHeaderFunctions(){
        let metaEl = document.querySelector('[name ="viewport"]');
        metaEl.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1');
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

