function homepageAnimations() {
    function onloadJS(){

    function heroBGAnimation() {
        let container = document.querySelector('.hero-bg-container');
        let interval = Math.round(container.getBoundingClientRect().width * 0.0333)
        console.log('interval is: ', interval)
        let linesList = document.querySelectorAll('.hero-bg-wrap');

        for (let i = 0; i < linesList.length; i++){
            linesList.item(i).style.transition = `opacity 0.2s cubic-bezier(0.455, 0.030, 0.515, 0.955) ${0.08 * i}s`
            linesList.item(i).style.height = `${100 + (3 * i)}%`
            linesList.item(i).style.transform = `translate(${interval * i}px)`
            linesList.item(i).style.opacity = '1' 
        };

        window.addEventListener('resize', (e)=>{
            console.log('window resized')
            interval = Math.round(container.getBoundingClientRect().width * 0.0333)
            console.log('interval is: ', interval)
            for (let i = 0; i < linesList.length; i++){
                linesList.item(i).style.transform = `translate(${interval * i}px)` 
            };

        })

    };
    

    function heroHeadingAnimation(){
        let txt = 'eveloper';
        let speed = 80;
        let heading = document.querySelector('.h1-hero-02');
        console.log('heading is:', heading)

        function typeWriter() {

            for (let i = 0; i < txt.length; i++){
                setTimeout(() => {
                    heading.innerHTML += txt.charAt(i);
                }, i * speed);
            };
        };

        function clearText(){
            heading.style.opacity = '0'
            heading.innerHTML = "D";
        }

        function startAnimation() {
            
            setTimeout(() => {
                console.log('Init Timeout Check')
                heading.style.opacity = '1'
                typeWriter();
            }, 1000);
        };

        //clearText();
        //startAnimation();
    };
    
    /*
    function bgBallHoverAnimation(){
        let ballA = document.querySelector('.hero-deco-ball-a');


        function animateA() {
            if (line && ballX && ballY && ballA){
                //define line element
            const line = document.getElementById('hero-deco-line-a');

            //calculate center of ball
            const rect = ballA.getBoundingClientRect();
            const ballX = rect.left + rect.width / 2;
            const ballY = rect.top + rect.height / 2;

            // Update line to follow the ball
            
            line.setAttribute('x2', ballX);
            line.setAttribute('y2', ballY);
            } else{ console.log('missing elements for hero ball animation') }
            

        };

        // play animations on mouseover
        document.addEventListener('mouseover', (event) => {
            animateA()
        });
    };
    */

    heroBGAnimation();
    heroHeadingAnimation();
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