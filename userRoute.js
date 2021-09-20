var express = require('express');
var users = [];   // empty json array initially
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/:userId', function(req, res){
    console.log("In /Users/{userId}. Params: ");
    console.log(req.params);
    var status = 404;
    var userData = {"message": "Not found", "status": status};
    for (var i = 0; i < users.length; i++) {
        if (users[i].userId === req.params['userId']) {
            status = 200;
            userData = users[i];
        }
    }
    res.setHeader('Content-Type', 'application/json');
    // respond a application/json
    res.status(status).send(userData);
});

router.get('/', function(req, res){
    var msg = "";
    if (users.length == 0) {
        msg = "There are no users yet<br><br>";
    }
    else {
        msg = JSON.stringify(users);
    }

    readModuleFile('./newuser.html', function (err, newuserhtml) {
        msg += newuserhtml;
        res.status(200).send(msg);
    });
});

//curl --header "Content-Type: application/json" --request POST --data '{"UserID":"xyz","firstName":"xyz"}'   http://localhost:3000/Users
router.post('/', function(req, res){
    //console.log(req);
    let uid = req.body.userId;
    let fname = req.body.firstName;
    let lname = req.body.lastName;
    let email = req.body.emailAddress;
    let passw = req.body.password;

    console.log("POST /Users recieved:");
    console.log(req.body);
    console.log(uid + " " + fname + " " + lname + " " + email + " " + passw);
    
    var respStr = "I dont know what happened";
    var status = 500;
    if (typeof uid == 'undefined' || typeof fname == 'undefined' 
    || typeof lname == 'undefined' || typeof email == 'undefined' 
    || typeof passw == 'undefined') {
        respStr = "Bad request. Some fields are undefined.";
        status = 400; // bad request
    }
    else {
        status = 200; 
        var present = false;
        for(var i = 0; i < users.length; i++) {
            if (users[i].userId == uid) {
                respStr = "UserId \"" + uid + "\" already exists!";
                present = true;
                break;
            }
        }
        
        if (!present) {
            // adding new user 
            status = 201;
            users.push(req.body);
            respStr = req.body;
        }
        
    }
    console.log("Sending status: " + status);
    res.status(status).send(respStr);
});

router.patch('/:userId', function(req, res){
    console.log("PATCH /Users Params:");
    console.log(req.params);

    var id = req.params['userId'];
    var present = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].userId === id) {
            present = true;
            break;
        }
    }

    res.setHeader('Content-Type', 'application/json');

    if (!present) {
        var status = 404;
        var resp = {"message": "User doesn't exist", "status": status};
        res.status(status).send(resp);
    }
    else {
        // TODO
        // user is present. Allow to PATCH except ID
        res.status(200).send("Work in Progress");
    }
});

router.delete('/:userId', function(req, res){
    console.log("DELETE /Users Params:");
    console.log(req.params);

    var id = req.params['userId'];
    var present = false;
    var userIdx = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].userId === id) {
            userIdx = i;
            present = true;
            break;
        }
    }

    res.setHeader('Content-Type', 'application/json');

    if (!present) {
        var status = 404;
        var resp = {"message": "User doesn't exist", "status": status};
        res.status(status).send(resp);
    }
    else {
        // user is present. Delete it
        users.splice(userIdx, 1);
        var resp = {"message": "User Deleted"};
        res.status(200).send(resp);
    }
});

// exporting so we can refer to this in index.js
module.exports = router;

// https://stackoverflow.com/questions/12752622/require-file-as-string
function readModuleFile(path, callback) {
    try {
        var filename = require.resolve(path);
        fs.readFile(filename, 'utf8', callback);
    } catch (e) {
        callback(e);
    }
}

