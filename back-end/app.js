const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const webRoute = require('./app/route/web');
//10080 cookie
live_key = '';
//set dist folder
app.use(express.json())
app.use(express.static(path.join(__dirname, '')));
app.use(express.static(path.resolve(__dirname, "dist")));
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true}));
app.use(bodyParser.json({ limit: '1000mb', extended: true}));
//routing
app.use('/_api', webRoute);
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "dist","index.html"));
});
module.exports = app;