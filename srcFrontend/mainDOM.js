import {setStylesOnElement, } from './service.js';

export function createPrevMainContainer() {
    // prevContainer is needed to fit first 2 dayContainers
    let prevMainContainer = document.createElement('div');
    prevMainContainer.id = "prevMainContainer";
    let stylesPrevMain = {
        width : "100%",
        height : "70px",
        position : "relative",
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

    let footer = document.createElement('footer');
    footer.id = "footer";
    let stylesFooter = {
        minWidth : "100%",
        height : "100px",
        marginTop : "50px",
        paddingTop: "15px",
        position : "relative",
        borderTop : "3px solid #b2c8ff",
        // backgroundColor : "#b2c8ff",
        // color : "#272932",
        fontSize : "20px",
        bottom : "-10px",
        left : "0px",
        display : "flex",
        alignItems : "baseline",
        justifyContent : "space-evenly",   
    }
    setStylesOnElement(footer, stylesFooter);

    let footerContacts = document.createElement('div');
    footerContacts.classList.add("footerElements");
    let githubMark = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"width="48" height="48"viewBox="0 0 48 48"style=" fill:#000000;"><path fill="#2100c4" d="M24,4C12.954,4,4,12.954,4,24c0,8.887,5.801,16.411,13.82,19.016h12.36 C38.199,40.411,44,32.887,44,24C44,12.954,35.046,4,24,4z"></path><path fill="#ddbaff" d="M37,23.5c0-2.897-0.875-4.966-2.355-6.424C35.591,15.394,34.339,12,34.339,12 c-2.5,0.5-4.367,1.5-5.609,2.376C27.262,14.115,25.671,14,24,14c-1.71,0-3.339,0.118-4.834,0.393 c-1.242-0.879-3.115-1.889-5.632-2.393c0,0-1.284,3.492-0.255,5.146C11.843,18.6,11,20.651,11,23.5 c0,6.122,3.879,8.578,9.209,9.274C19.466,33.647,19,34.764,19,36l0,0.305c-0.163,0.045-0.332,0.084-0.514,0.108 c-1.107,0.143-2.271,0-2.833-0.333c-0.562-0.333-1.229-1.083-1.729-1.813c-0.422-0.616-1.263-2.032-3.416-1.979 c-0.376-0.01-0.548,0.343-0.5,0.563c0.043,0.194,0.213,0.5,0.896,0.75c0.685,0.251,1.063,0.854,1.438,1.458 c0.418,0.674,0.417,2.468,2.562,3.416c1.53,0.677,2.988,0.594,4.097,0.327l0.001,3.199c0,0.639-0.585,1.125-1.191,1.013 C19.755,43.668,21.833,44,24,44c2.166,0,4.243-0.332,6.19-0.984C29.584,43.127,29,42.641,29,42.002L29,36 c0-1.236-0.466-2.353-1.209-3.226C33.121,32.078,37,29.622,37,23.5z"></path><path fill="#ddbaff" d="M15,18l3.838-1.279c1.01-0.337,1.231-1.684,0.365-2.302l-0.037-0.026 c-2.399,0.44-4.445,1.291-5.888,2.753C13.596,17.658,14.129,18,15,18z"></path><path fill="#ddbaff" d="M28.693,14.402c-0.878,0.623-0.655,1.987,0.366,2.327L32.872,18c0.913,0,1.461-0.37,1.773-0.924 c-1.46-1.438-3.513-2.274-5.915-2.701C28.717,14.384,28.705,14.393,28.693,14.402z"></path><path fill="#ddbaff" d="M24,31c-1.525,0-2.874,0.697-3.791,1.774C21.409,32.931,22.681,33,24,33s2.591-0.069,3.791-0.226 C26.874,31.697,25.525,31,24,31z"></path></svg>`;
    footerContacts.innerHTML = `<div>Created by Gleb Markin <br> <a href="mailto:glebmarkreply@yandex.ru">glebmarkreply@yandex.ru</a> \u00a0\u00a0</div><a href="https://github.com/glebmark/weatherapp" target='_blank'>${githubMark}</a>`

    let footerOpenMeteo = document.createElement('div');
    footerOpenMeteo.classList.add("footerElements");
    footerOpenMeteo.innerHTML = "<div>Weather and geo location <br> data by <a href='https://open-meteo.com/' target='_blank'> Open-Meteo.com</a></div>"
    
    let footerLicense = document.createElement('div');
    footerLicense.classList.add("footerElements");
    footerLicense.innerHTML = "<div>Content on this site is \
    licensed under a <a href='https://creativecommons.org/licenses/by-nc/4.0/' target='_blank'> Creative commons <br> Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)</a></div>"


    footer.appendChild(footerContacts);
    footer.appendChild(footerOpenMeteo);
    footer.appendChild(footerLicense);
    document.body.appendChild(footer);

    
    
}

export function createOverlay() {
    let overlay = document.createElement('div');
        overlay.id = "overlay";

        let stylesOverlay = {
            position: "fixed",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            background: "rgba(39, 41, 50, 0.7)",
            transition: "background 0.5s ease-out",
            zIndex: "150",
    
        }
        setStylesOnElement(overlay, stylesOverlay);
    document.body.appendChild(overlay);
    return overlay
}