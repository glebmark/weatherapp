"use strict";

import express from "express";
const app = express();
import {testMiddleFunc1, amIexceedAPIlimit} from "./middle.mjs";
import cors from "cors";
import fetch from 'node-fetch';
import fs from "fs";
// import { waitForDebugger } from "inspector";

app.use(testMiddleFunc1); // this is just testing middle function for all requests
// app.use(amIexceedAPIlimit); // this is just testing middle function for all requests
app.use(cors());

let optionsForStatic = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    // index: false,
    maxAge: '1d',
    redirect: true,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
};

app.use(express.static("dist", optionsForStatic));



// function appendData(data, path) {
//     let dataInString = JSON.stringify(data)
//     fs.writeFile("weatherData.json", dataInString, (err) => {
//         if (err) throw err;
//         console.log('Weather data written to file');
//     })
// }

// let defaultCityValues = {
//     name: "Москва",
//     area: "Москва",
//     country: "Россия",
//     latitude: 55.75222,
//     longitude: 37.61556,
//     timezone: "Europe/Moscow"
// };

// let defaultPath = `./cashedWeatherData/weatherDataLatitude${defaultCityValues.latitude}Longitude${defaultCityValues.longitude}.json`;

// setInterval(loadDataFromOpenMeteo(defaultCityValues, defaultPath), 3600000) // load data from callback once a hour 3600000

app.get("/weatherData", amIexceedAPIlimit, (req, res) => { // save JSON on server, then clients will take file from here
    
    function isWeatherFileExist(cityValues, pathWeather) {
        try {
            if(!fs.existsSync(pathWeather)) {
                throw new TypeError("weatherData file wasn't found")
            } else {
                let rawWeatherData = fs.readFileSync(pathWeather);
                let weatherData = JSON.parse(rawWeatherData);
    
                let localDate = new Date().toLocaleString('en-US', { timeZone: cityValues.timezone });
                let localDateObj = new Date(localDate);
                let localTimeStamp = localDateObj.getTime();
                let savedLocalTimeStamp = weatherData["localTimeStamp"];
                let localTimeStampDelta = localTimeStamp - savedLocalTimeStamp;
                console.log("Current timestamp: " + localTimeStamp + " saved timestamp: " + savedLocalTimeStamp + " delta between timestamps: " + localTimeStampDelta)
    
                if (localTimeStampDelta >= 3600000) {
                    console.log("This weather data expired! Request new one! Requested file:" + pathWeather)
                    return false;
                } else {
                    console.log("Weather data is up to date, send cashed file!")
                    return pathWeather;
                }
            }

        } catch (e) {
            console.log(e);
            return false;
        }
        
    }


    function loadDataFromOpenMeteo(cityValues, pathWeather) {
        // let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&windspeed_unit=ms&daily=sunrise,sunset&timezone=Europe%2FMoscow&past_days=2";
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${cityValues.latitude}&longitude=${cityValues.longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&windspeed_unit=ms&daily=sunrise,sunset&timezone=${encodeURI(cityValues.timezone)}&past_days=2`;
        fetch(url)
            .then(response => {
    
                if (!response.ok) {
                    return null
                }
    
                let type = response.headers.get("content-type"); 
                if (type !== "application/json; charset=utf-8") {
                    throw new TypeError(`Expected JSON, got ${type}`)
                }
    
                return response.json();
            })
            .then(data => {
                if(data) {

                    data["localTimeZone"] = cityValues.timezone;


                    // write timestamp to file, so later it will be possible to check wether file up to date (if 3600000 ms passed since last request)
                    let localDate = new Date().toLocaleString('en-US', { timeZone: cityValues.timezone });
                    let localDateObj = new Date(localDate);
                    let localTimeStamp = localDateObj.getTime();
                    data["localTimeStamp"] = localTimeStamp;
                    data["cityName"] = cityValues.name;
                    console.log("WrittenTimeStamp" + data["localTimeStamp"])
                    

                    let dataInString = JSON.stringify(data)
                    async function writeToFile() {
                        await fs.promises.writeFile(pathWeather, dataInString, (err) => {
                            if (err) throw err;
                            console.log('Weather data written to file');
                        });
                    }
                    
                    writeToFile().then(() => {
                        res.sendFile(pathWeather, { root: "."}); // not __dirname but "." because it's .mjs file
                        console.log(`New weather file sent, path ${pathWeather}`)
                    })
    
    
                } else {
                    console.log("Didn't get 2xx and not called appendData")
                }
                
            })
            .catch(e => console.error(e));
    
    }




    let pathWeather = `./cashedWeatherData/weatherDataLatitude${req.query.latitude}Longitude${req.query.longitude}City${req.query.name}.json`;

    // add timezone to weatherData before response + handle it on front side for current CLOCK
    
    // load loadDataFromOpenMeteo from here with req
    console.log("THIS IS LATITUDE" + req.query.latitude);
    console.log("THIS IS LATITUDE" + req.query.longitude);
    console.log("THIS IS LATITUDE" + req.query.timezone);

    let cityValues = {
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        timezone: req.query.timezone,
        name: req.query.name,
    };

    
    
    if (isWeatherFileExist(cityValues, pathWeather)) {
        if (!res.headersSent) {
            // res.type("application/json");
            res.sendFile(pathWeather, { root: "."}); // not __dirname but "." because it's .mjs file
            console.log(`Cashed weather file sent, path ${pathWeather}`)
        }
    } else {
        loadDataFromOpenMeteo(cityValues, pathWeather)
    }


    // if (!res.headersSent) {
    //     // res.type("application/json");
    //     res.sendFile("./weatherData.json", { root: "."}); // not __dirname but "." because it's .mjs file
    // }
});


app.get("/geoLocation", amIexceedAPIlimit, (req, res) => { // save JSON on server, then clients will take file from here
    // console.log(req)

    function isGeoFileExist(pathGeo) {
        try {
            if(!fs.existsSync(pathGeo)) {
                throw new TypeError("geoLocation file wasn't found")
            };
            return pathGeo;
        } catch {
            return false;
        }
        
    }

    
    function requestNewGeoLocationJSON(cityName, pathGeo) {
        let url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&language=ru`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    return null
                }
        
                let type = response.headers.get("content-type"); 
                if (type !== "application/json; charset=utf-8") {
                    throw new TypeError(`Expected JSON, got ${type}`)
                }
        
                return response.json();
            })
            .then(data => {
                if(data) {
                    let dataInString = JSON.stringify(data)
                    async function writeToFile() {
                        await fs.promises.writeFile(pathGeo, dataInString, (err) => {
                            if (err) throw err;
                            console.log('Geo data written to file');
                        });
                    }
                    
                    writeToFile().then(() => {
                        res.sendFile(pathGeo, { root: "."}); // not __dirname but "." because it's .mjs file
                        console.log(`New geo file sent, path ${pathGeo} for city ${req.query.name}`)
                    })
                    
                } else {
                    console.log("Didn't get 2xx and not called appendGeo")
                }
            })
            .catch(e => console.error(e));
    }


    
    let cityName = encodeURI(req.query.name);
    let pathGeo = `./cashedCitiesGeo/geoData${cityName}.json`;
    
    if (isGeoFileExist(pathGeo)) {
        if (!res.headersSent) {
            // res.type("application/json");
            res.sendFile(pathGeo, { root: "."}); // not __dirname but "." because it's .mjs file
            console.log(`Cashed geo file sent, path ${pathGeo} for city ${req.query.name}`)
        }
    } else {
        requestNewGeoLocationJSON(cityName, pathGeo);
    }

});



const HTTP_PORT = process.env.port || 3005;
app.listen(HTTP_PORT, (err) => { // change 3000 to 80 for HTTP
    if (err) {
        console.log(`there was error ${err}`);
        return;
    }
    console.log(`listening on port ${HTTP_PORT}`)
});