export function setStylesOnElement(element, styles) {
    Object.assign(element.style, styles);
}



// let styles = {};
        // let mql = window.matchMedia('(min-width: 768px)');

        // function screenTest(e) {
        //   if (e.matches) {
        //     /* the viewport is 768 pixels wide or more */
        //     styles = {
        //         marginLeft :"3px",       
        //         border : "1px solid white",
        //         display : "flex",
        //         flexDirection : "row",
        //         justifyContent : "space-evenly",
        //         alignItems : "center",
        //         gridColumnStart : "1",
        //         gridColumnEnd : "18",
        //         gridRowStart : "1",
        //         gridRowEnd : "10", 
        //     }
        //   } else {
        //     /* the viewport is less than 768 pixels wide */
        //     styles = {
        //         marginLeft :"3px",       
        //         border : "1px solid white",
        //         display : "flex",
        //         flexDirection : "row",
        //         justifyContent : "space-evenly",
        //         alignItems : "center",
        //         gridColumnStart : "1",
        //         gridColumnEnd : "18",
        //         gridRowStart : "1",
        //         gridRowEnd : "6", 
        //     }
        //   }
        // }
      
        // screenTest(mql);
        // mql.addEventListener('change', screenTest, false);