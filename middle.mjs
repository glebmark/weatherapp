"use strict";

// only for test
const sup = (req, res, next) => {
    console.log(req.method);
    // console.log(req.path); // just path of the url
    // console.log(`it's requested URL: ${req.url}`);

    // console.log(req.headers);
    // console.log(req.ip);
    // console.log(req.protocol);
    // console.log(req.query); //query string
    // console.log(req.subdomains);
    // console.log(req.params);
    console.log("sup");
    next();
}

// only for test
function heh(req, res, next) {
    console.log("testtest")
    next();
}

export {sup, heh};