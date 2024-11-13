function homepageAnimations() {
    function onloadJS(){

    function heroBGAnimation() {
        let gridList = document.querySelectorAll('.bg-line-grid');
        let intervalX = 3.33;
        let intervalY = 3.33 * 0.5;

        gridList.forEach((el, index) => {
            
            el.style.gridTemplateColumns = `calc(${intervalX * index}%) var(--hero-bg-x-start-a) calc(var(--hero-bg-x-start-b) - ${intervalX * index}%)`
            el.style.gridTemplateRows = `calc(var(--hero-bg-y-start) + ${intervalY * index}%) calc(100% - var(--hero-bg-y-start) - ${intervalY * index}%)`
        });

    };
    
    heroBGAnimation();
    console.log('animations started')


};

function executeOnloadJS() {

    if (window.addEventListener){window.addEventListener("load", onloadJS, false)}

    else if (window.attachEvent){window.attachEvent("load", onloadJS)}

    else {window.onload = onloadJS()}
}

executeOnloadJS();

};
homepageAnimations();