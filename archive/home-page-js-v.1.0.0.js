function homepageAnimations() {
    function onloadJS(){
    
    /*
    function heroBGAnimation() {
        let container = document.querySelector('.hero-bg-container');
        let interval = Math.round(container.getBoundingClientRect().width * 0.0333)
        console.log('interval is: ', interval)
        let linesList = document.querySelectorAll('.hero-bg-wrap');

        for (let i = 0; i < linesList.length; i++){
            linesList.item(i).style.height = `round(calc(100% + ${2 * i}vw), 1px)`
            linesList.item(i).style.left = `${interval * i}px`
            linesList.item(i).style.zIndex = `${1 + i}` 
            
        };

        window.addEventListener('resize', (e)=>{
            console.log('window resized')
            interval = Math.round(container.getBoundingClientRect().width * 0.0333)
            console.log('interval is: ', interval)
            for (let i = 0; i < linesList.length; i++){
                linesList.item(i).style.left = `${interval * i}px` 
            };

        })

    };
    */

    function heroBGAnimation() {
        let container = document.querySelector('.hero-bg-container');
        let interval = Math.round(container.getBoundingClientRect().width * 0.0333)
        console.log('interval is: ', interval)
        let wrapList = document.querySelectorAll('.hero-bg-wrap');
        let bgBlocks = document.querySelectorAll('.hero-bg-area-wrap');


        function scaleBG(){
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
        

        scaleBG();

    };
    

    function heroSVGAnimation(){
        let container = document.querySelector('.hero-bg-container');
        let svgElement = document.querySelector('.hero-bg-svg');

        function resizeSVG(){
            svgElement.setAttribute('width', container.getBoundingClientRect().width);
            svgElement.setAttribute('height', container.getBoundingClientRect().height);
        }

        window.addEventListener('resize', (e)=>{
            console.log('svg resized')
            resizeSVG()
        });

        resizeSVG();

    }

    function aboutBGAnimation(){
        let container = document.querySelector('.about-section-bg-wrap');
        let squares = container.querySelectorAll('.about-bg-line');

        for (let i = 1; i < squares.length; i++){
            squares.item(i).style.transition = `opacity 0.2s cubic-bezier(0.455, 0.030, 0.515, 0.955) ${2.1 + (0.08 * i)}s`
            squares.item(i).style.opacity = '1'  
            
        };
    };
    
    heroBGAnimation();
    //aboutBGAnimation();
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