"use strict";

// const express = require("express");
import express from "express";
const app = express();

// const {sup, heh} = require("./middle").default;
import {sup, heh} from "./middle.mjs";

// const cors = require("cors");
import cors from "cors";

// const fetch = require('node-fetch');
import fetch from 'node-fetch';

import fs from "fs";

app.use(sup); // this is just testing middle function for all requests
app.use(heh); // this is just testing middle function for all requests
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

// let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&daily=sunrise,sunset&timezone=Europe%2FMoscow&past_days=2"
// fetch(url)
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         appendData(data); // json taken only from here, not from outside
//     })
//     .catch(function (err) {
//         console.log(err);
//     });

function loadDataFromOpenMeteo() {
    let url = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6176&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,precipitation,weathercode,cloudcover,windspeed_10m&daily=sunrise,sunset&timezone=Europe%2FMoscow&past_days=2"
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            appendData(data); // json taken only from here, not from outside
        })
        .catch(err => {
            console.log(err);
        });
}

setInterval(loadDataFromOpenMeteo, 3600000) // load data from callback once a hour

function appendData(data) {
    let dataInString = JSON.stringify(data)
    fs.writeFile("weatherData.json", dataInString, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    })
    // console.log(data)
}

app.get("/getWeatherData", (req, res) => {
    if (!res.headersSent) {
        res.sendFile("./weatherData.json", { root: "."}); // not __dirname but "." because it's .mjs file
    }
});

app.get("/hey",(req, res) => { // sup, heh, 
    
    let s = "hi";
    res.send(`<p>${s}</p>`);

    // res.json({mem: "hi"});

    // res.sendFile("./path/to/file", err => console.log);

    // res.redirect(301, "/path/to/")

    // res.end();
});

// app.post("/", (req, res) => {

// })


const HTTP_PORT = process.env.port || 3005;
app.listen(HTTP_PORT, (err) => { // change 3000 to 80 for HTTP
    if (err) {
        console.log(`there was error ${err}`);
        return;
    }
    console.log(`listening on port ${HTTP_PORT}`)
});