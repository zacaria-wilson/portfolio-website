function homepageAnimations() {
    function onloadJS(){

    function heroBGAnimation() {
        let container = document.querySelector('.hero-bg-container');
        let interval = Math.round(container.getBoundingClientRect().width * 0.0333)
        console.log('interval is: ', interval)
        let wrapList = document.querySelectorAll('.hero-bg-wrap');
        let bgBlocks = document.querySelectorAll('.hero-bg-area-wrap');


        wrapList.forEach((el, index) => {
            let lineA = el.querySelector('.hero-bg-line-a');
            let lineB = el.querySelector('.hero-bg-line-b');
            let lineC = el.querySelector('.hero-bg-line-c');

            let intervalX = 3.33;
            let intervalY = 3.33 * 0.5;
            console.log('el is:', el, 'lines:', lineA, lineB, lineC);

            lineA.style.height = `round(up, calc(var(--hero-bg-y-start) + ${intervalY * index}% + var(--border-width-01)), 1px)`;
            lineA.style.left = `round(calc(var(--hero-bg-x-start) + ${intervalX * index}% - var(--border-width-01)), 1px)`;

            lineB.style.top = `round(up, calc(var(--hero-bg-y-start) + ${intervalY * index}%), 1px)`;
            lineB.style.left = `round(${intervalX * index}%, 1px)`;
            

            lineC.style.height = `round(up, calc(30% - ${intervalY * index}%), 1px)`;
            lineC.style.top = `round(up, calc(var(--hero-bg-y-start) + ${intervalY * index}%), 1px)`;
            lineC.style.left = `round(${intervalX * index}%, 1px)`;
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