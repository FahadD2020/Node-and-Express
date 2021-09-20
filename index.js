var express = require('express');
var userRoute = require('./userRoute.js');
var app = express();
var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/', function(req, res){
    // default route - send a help html
    res.sendFile(path.join(__dirname, '/help.html'));
});

app.use(express.json());
app.use('/Users', userRoute);   // route handler for /Users

app.listen(3000);