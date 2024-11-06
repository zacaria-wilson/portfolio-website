function onloadJS(){

    function heroBGAnimation() {
        let container = document.querySelector('.side-line-container');
        let interval = Math.round(container.getBoundingClientRect().width * 0.1)
        console.log('interval is: ', interval)
        let linesListA = document.querySelectorAll('.contact-bg-block-a');
        let linesListB = document.querySelectorAll('.contact-bg-block-b');


        function linesAnimation(linesList, direction, factor){
            for (let i = 0; i < linesList.length; i++){
                linesList.item(i).style.transition = `opacity 0.2s cubic-bezier(0.455, 0.030, 0.515, 0.955) ${0.08 * i}s`
                linesList.item(i).style.height = `calc(100% + ${interval * i}px)`
                linesList.item(i).style.transform = `translate(${interval * i}px, ${direction}${interval * i * factor}px)`
                linesList.item(i).style.opacity = '1' 
            };
        }

        linesAnimation(linesListA, '+',2)
        linesAnimation(linesListB, '+',0)
        

        window.addEventListener('resize', (e)=>{
            console.log('window resized')
            interval = Math.round(container.getBoundingClientRect().width * 0.0333)
            console.log('interval is: ', interval)
            linesAnimation(linesListA, '+',2)
            linesAnimation(linesListB, '+',0)

        })

    };

    heroBGAnimation();

    console.log('animations started')

};


//#region Onload Checker

function executeOnloadJS() {

    if (window.addEventListener){window.addEventListener("load", onloadJS, false);}
    
    else if (window.attachEvent){window.attachEvent("load", onloadJS);}
    
    else {window.onload = onloadJS();}
}
    
executeOnloadJS();

//#endregion