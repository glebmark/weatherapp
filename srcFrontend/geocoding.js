import {setStylesOnElement, } from './service.js';
import {getWeatherData, } from './weatherDataLoader.js';

export function createGeoContainer() {

    let geoContainer = document.createElement('div');
    geoContainer.id = "geoContainer";
    let stylesGeoContainer = {
        width : "50%",
        height : "100px",
        marginLeft : "20px",
        position : "relative",
        top : "40px",
        display : "flex",
        flexDirection : "row",
        flexWrap : "wrap",
        justifyContent: "space-around",
        alignItems: "center",
        
        border : "3px solid #b2c8ff",
        borderTopRightRadius : "60px 40px",
        borderTopLeftRadius : "60px 40px",
        borderBottomRightRadius : "60px 40px",
        borderBottomLeftRadius : "60px 40px",

    }
    setStylesOnElement(geoContainer, stylesGeoContainer);


    let geoForm = document.createElement('form');
    geoForm.id = "geoForm";

    let geoTextInput = document.createElement('input');
    geoTextInput.id = "geoTextInput";
    geoTextInput.type = "text";
    geoTextInput.placeholder = "Москва";
    geoTextInput.name = "city";
    geoTextInput.value = "";

    let geoTextButton = document.createElement('input');
    geoTextButton.id = "geoTextButton";
    geoTextButton.type = "button";
    geoTextButton.value = "Найти";

    geoTextButton.addEventListener("click", requestGeoLocation);
    geoTextInput.addEventListener("keydown", requestGeoLocation);

    function requestGeoLocation(keydown) {
        
        
        console.log(keydown)

        if (keydown.key === "Enter") {
            console.log("it's Enter");
            keydown.preventDefault();
        }

        if (keydown.key) {
            if (keydown.key !== "Enter") {
                console.log("it's return")
                return
            }
        }
        
        

        let oldTable = document.getElementById("tableCities");
        if (oldTable) {
            oldTable.remove();
        }
        // let url = `http://www.glebmark.com/geoLocation?name=${geoTextInput.value}`;
        let url = `http://localhost:3005/geoLocation?name=${geoTextInput.value}`;
        
        fetch(url)
        .then(response => {
            if (!response.ok) {
                return null
            }
    
            let type = response.headers.get("content-type"); 
            if (type !== "application/json; charset=UTF-8") {
                throw new TypeError(`Expected JSON, got ${type}`)
            }
    
            return response.json();
        })
        .then(data => {
            if(data) {
                appendGeo(data); // json taken only from here, not from outside
            } else {
                console.log("Didn't get 2xx and not called appendGeo")
            }
        })
        .catch(e => console.error(e));

    }


    function appendGeo(data) {
        let geoListOfAllAvailableCities = document.getElementById("geoListOfAllAvailableCities");
        geoListOfAllAvailableCities.style.display = "flex";

        // button.addEventListener("click", () => {}
        

            let table = document.createElement('table');
            table.id = "tableCities"
            table.style.borderSpacing = "0";
            let tableHead = document.createElement('thead');
            let tableHeadrow = document.createElement('tr');
            let tableHeaderName = document.createElement('th');
            tableHeaderName.innerText = "Город";
            let tableHeaderArea = document.createElement('th');
            tableHeaderArea.innerText = "Область";
            let tableHeaderCountry = document.createElement('th');
            tableHeaderCountry.innerText = "Страна";
            let tableHeaderLatitude = document.createElement('th');
            tableHeaderLatitude.innerText = "Широта";
            let tableHeaderLongitude = document.createElement('th');
            tableHeaderLongitude.innerText = "Долгота";
            

            let tableBody = document.createElement('tbody');
            data.results.forEach(city => {
                let tableBodyRow = document.createElement('tr');
                // tableBodyRow.id = "tableBodyRow";
                tableBodyRow.classList.add("tableBodyRow");

                tableBodyRow.addEventListener("click", () => {

                    let cityValues = {
                        name: city.name,
                        area: city.admin1,
                        country: city.country,
                        latitude: city.latitude,
                        longitude: city.longitude,
                        timezone: city.timezone
                    };

                    getWeatherData(cityValues);


                    table.remove();
                    geoListOfAllAvailableCities.style.display = "none";
                })

                let tableBodyName = document.createElement('td');
                tableBodyName.innerText = city.name;
                let tableBodyArea = document.createElement('td');
                tableBodyArea.innerText = city.admin1;
                let tableBodyCountry = document.createElement('td');
                tableBodyCountry.innerText = city.country;
                let tableBodyLatitude = document.createElement('td');
                tableBodyLatitude.innerText = city.latitude;
                let tableBodyLongitude = document.createElement('td');
                tableBodyLongitude.innerText = city.longitude;

                tableBodyRow.append(tableBodyName, tableBodyArea, tableBodyCountry, tableBodyLatitude, tableBodyLongitude);
                tableBody.appendChild(tableBodyRow);
            })
            





            tableHeadrow.append(tableHeaderName, tableHeaderArea, tableHeaderCountry, tableHeaderLatitude, tableHeaderLongitude);
            tableHead.appendChild(tableHeadrow);


            table.append(tableHead, tableBody);
            geoListOfAllAvailableCities.appendChild(table);


            document.addEventListener("click", event => {
                if (event.target.id === "geoListOfAllAvailableCities" || 
                event.target.tagName === "TH" ||
                event.target.tagName === "TR") {
                    console.log("this is geoListOfAllAvailableCities or TH or TR, can't conceal it")
                } else {
                    geoListOfAllAvailableCities.style.display = "none";
                }
            })
    }




    let geoCurrentCity = document.createElement('div');
    geoCurrentCity.id = "geoCurrentCity";
    // geoCurrentCity.innerText = "Текущий город"
    let stylesGeoCurrentCity = {
        width : "50%",
        height : "50px",
        // marginLeft : "20px",
        // position : "relative",
        // top : "40px",
        display : "flex",
        flexDirection : "row",
        // flexWrap : "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        
        
        // border : "3px solid #b2c8ff",
        // borderTopRightRadius : "60px 40px",
        // borderTopLeftRadius : "60px 40px",
        // borderBottomRightRadius : "60px 40px",
        // borderBottomLeftRadius : "60px 40px",

    }
    setStylesOnElement(geoCurrentCity, stylesGeoCurrentCity);


    let geoListOfAllAvailableCities = document.createElement('div');
    geoListOfAllAvailableCities.id = "geoListOfAllAvailableCities";
    // geoListOfAllAvailableCities.style.display = "none";
    let stylesgeoListOfAllAvailableCities = {
        minWidth : "500px",
        // height : "50px",
        // marginLeft : "20px",
        padding: "20px",
        position : "absolute",
        // top : "40px",
        display : "none",
        zIndex: "199",
        backgroundColor: "#272932",
        flexDirection : "row",
        // flexWrap : "wrap",
        justifyContent: "space-around",
        alignItems: "flex-start",
        
        border : "3px solid #b2c8ff",
        borderTopRightRadius : "60px 40px",
        borderTopLeftRadius : "60px 40px",
        borderBottomRightRadius : "60px 40px",
        borderBottomLeftRadius : "60px 40px",

    }
    setStylesOnElement(geoListOfAllAvailableCities, stylesgeoListOfAllAvailableCities);
    



    geoForm.append(geoTextInput, geoTextButton);
    geoForm.appendChild(geoListOfAllAvailableCities);
    geoContainer.appendChild(geoForm);
    geoContainer.appendChild(geoCurrentCity);
    document.body.appendChild(geoContainer);
}