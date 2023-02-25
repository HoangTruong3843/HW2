/*
CSC3916 HW2
file: server.js
Description: web API scaffolding for Movie API
*/

var express = require('express');
var http = require('http');
var body_parser = require('body-parser');
var passport = require('passport');
db = require('./db')(); //This is a hack :D, to pull from db.js file
var jwt = require('jsonwebtoken');
var cors = require('cors');
const bodyParser = require('body-parser');
const { application } = require('express');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

var router = express.Router();

// we should create a function that return movies (GET method, POST method,
//PUT method, DELETE method) to "get movies","save movie","update movie","delete movie"
function getJSONObjectForMovieRequirement(req){
    var json = {
        headers: "NO headers",
        key: process.env.UNIQUE_KEY,
        body: "NO body"
    };
    if (req.body != null){
        json.body = req.body;
    }
    if (req.headers!= null){
        json.headers = req.headers;
    }
    return json;
}

// next req for this assignment: The server should have three different
// routes that only accept a given HTTP methods, while reject the other methods

    //  1st route: /signup --> HTTP Method is POST
    router.post('/signup',function(req,res){
        if (!req.body.username || !req.body.password){
            res.json({success: false,msg:'Please include both username and password to signup.'})
        }
        else{
            var newUser = {
                username: req.body.username,
                password: req.body.password
            };
            db.save(newUser); // no duplicate checking
            res.json({success: true, msg: 'Successfully created new user.'})
        }
    }
    );

    //2nd: Now is the signin method --> using HTTP method:  POST
    router.post('/signin',function(req,res){
        var user = db.findOne(req.body.username);
        
        if(!user){
            res.status(481).send({success:false, msg:'Authentication failed. User not found'});
        }
        else {
            if (req.body.password == user.password){
                var userToken = {id: user.id, username: user.username};
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json({success: true, token: 'JWT' + token});
            }
            else {
                res.status(481).send({success: false, msg: 'Authentication failed.'});
            }
        }
    });


//FOR TESTING ONLY
app.use('/',router);
app.listen(process.env.PORT || 8888);
module.exports = app; 
//END TESTING 



