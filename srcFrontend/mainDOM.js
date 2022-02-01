import {setStylesOnElement, } from './service.js';

export function createPrevMainContainer() {
    // prevContainer is needed to fit first 2 dayContainers
    let prevMainContainer = document.createElement('div');
    prevMainContainer.id = "prevMainContainer";
    let stylesPrevMain = {
        width : "100%",
        height : "70px",
        position : "relative",
        top : "40px",
        display : "flex",
        flexDirection : "row",
        flexWrap : "wrap",
        // border : "3px solid #b2c8ff",
    }
    setStylesOnElement(prevMainContainer, stylesPrevMain);

    let stylesButtons = {
        border : "3px solid #b2c8ff",
        height : "50px",
        borderTopRightRadius : "60px 40px",
        borderTopLeftRadius : "60px 40px",
        borderBottomRightRadius : "60px 40px",
        borderBottomLeftRadius : "60px 40px",
        // display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }

    let buttonDayBeforeYesterday = document.createElement('div');
    buttonDayBeforeYesterday.classList.add("buttonsPrevContainerClass");
    buttonDayBeforeYesterday.id = "buttonDayBeforeYesterday";
    // buttonDayBeforeYesterday.style.display = "none";  
    // buttonDayBeforeYesterday.innerText = "Ранее"            
    setStylesOnElement(buttonDayBeforeYesterday, stylesButtons);
    prevMainContainer.appendChild(buttonDayBeforeYesterday);

    let buttonYesterday = document.createElement('div');
    buttonYesterday.classList.add("buttonsPrevContainerClass");
    buttonYesterday.id = "buttonYesterday";
    // buttonYesterday.style.backgroundColor = "transparent";
    // buttonYesterday.style.position = "absolute"; 
    // buttonYesterday.style.display = "none";
    buttonYesterday.innerText = "Ранее"          
    buttonYesterday.style.display = "flex";  
    setStylesOnElement(buttonYesterday, stylesButtons);
    prevMainContainer.appendChild(buttonYesterday);
    document.body.appendChild(prevMainContainer);

    document.querySelectorAll(".buttonsPrevContainerClass").forEach(button => {
        
        button.addEventListener("click", () => {
            
            buttonYesterday.style.backgroundColor = "transparent";
            buttonYesterday.style.color = "inherit";        
            buttonYesterday.innerText = "Позавчера" // only for mobile, then rewrite for desktop down below

            let mql = window.matchMedia('(min-width: 768px)');
            function screenTest(e) {
            if (e.matches) {
                /* the viewport is 768 pixels wide or more */

                buttonDayBeforeYesterday.innerText = "Позавчера"
                buttonDayBeforeYesterday.style.display = "flex";
                buttonYesterday.innerText = "Вчера" 

                // animation of Yesterday button to the right
                let id = null;
                let pos = 0;
                clearInterval(id);
                id = setInterval(frame, 5);
                function frame() {
                    if (pos >= 540) {
                        clearInterval(id);
                    } else {
                        pos += 3; 
                        // buttonYesterday.style.top = pos + "px"; 
                        buttonYesterday.style.left = pos + "px"; 
                    }
                }    

            } else {
                /* the viewport is less than 768 pixels wide */
                
                prevMainContainer.style.height = "150px";
                prevMainContainer.style.transition = "all 1s";
                prevMainContainer.style.transitionTimingFunction = "ease";

                setTimeout(() => {
                    buttonYesterday.innerText = "Вчера";
                    buttonDayBeforeYesterday.innerText = "Позавчера";
                    buttonDayBeforeYesterday.style.display = "flex";
                }, 1000)
                
            }
            }
            
            screenTest(mql);
            mql.addEventListener('change', screenTest, false);

            setTimeout(() => {
                prevMainContainer.style.height = "";

                buttonDayBeforeYesterday.style.height = "300px";
                buttonDayBeforeYesterday.style.transition =  "all 1s",
                buttonDayBeforeYesterday.style.transitionTimingFunction = "ease",
                buttonDayBeforeYesterday.style.position = "static";
                
                buttonYesterday.style.height = "300px";
                buttonYesterday.style.transition =  "all 1s",
                buttonYesterday.style.transitionTimingFunction = "ease"
                buttonYesterday.style.position = "static";
            }, 1500)

            setTimeout(() => {
                buttonDayBeforeYesterday.style.display = "none";
                buttonYesterday.style.display = "none";
                let dayContainer1 = document.getElementById("dayContainer1");
                dayContainer1.style.display = "flex";
                let dayContainer2 = document.getElementById("dayContainer2");
                dayContainer2.style.display = "flex";
            }, 2500)        
        })
    })
}

export function createMainContainerAndHeader() {
    // mainContainer is needed to fit 7 dayContainers
    let mainContainer = document.createElement('div');
    mainContainer.id = "mainContainer";
    let stylesMain = {
        width : "100%",
        // height : "100%",
        position : "relative",
        top : "40px",
        display : "flex",
        minWidth : "0",
        flexDirection : "row",
        flexWrap : "wrap",
    }
    setStylesOnElement(mainContainer, stylesMain);

    document.body.appendChild(mainContainer);


    let header = document.createElement('header');
    header.id = "header";
    header.innerText = "Прогноз погоды";
    let stylesHeader = {
        minWidth : "100%",
        height : "30px",
        position : "fixed",
        border : "1px solid black",
        backgroundColor : "#b2c8ff",
        zIndex : "199",
        color : "#272932",
        fontSize : "20px",
        top : "-1px",
        left : "0px",
        display : "flex",
        alignItems : "center",
        justifyContent : "space-evenly",   
    }
    setStylesOnElement(header, stylesHeader);
    document.body.appendChild(header);
}