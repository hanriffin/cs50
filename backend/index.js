require("dotenv").config();

// const client_id = process.env.client_id;
// const client_secret = process.env.client_secret;
// const redirect_uri = 'http://localhost:8080/callback/';

// const fetch = require('node-fetch');
// const queryString = require('querystring');
// const crypto = require("crypto");
const routesHandler = require('./routes/handler.js');
const cors = require("cors");
const express = require("express");
const cookieParser = require('cookie-parser')
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept'
//     )
//     next()
// })


app.use('/', routesHandler)
app.use('/', cors)
app.use(cookieParser())

// var access_token = null;



app.listen(8080, () => {
    console.log("App is listening on port 8080!\n");
});


// Landing page
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/routes/index.html");
// });

