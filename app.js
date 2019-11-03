/*global _ */

const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');
const shuffle = require('shuffle-array');

//routes
app.get("/", async function(req, res){
    let word = ["pencil", "truck", "hyroflask", "headphones", "computer"];
    let start = shuffle(word);
    let parsedData = await getImages(start[0], "");
    parsedData.hits = shuffle(parsedData.hits);
    res.render("index", {"images":parsedData.hits});
});

app.get("/results", async function(req, res){
    let keyword = req.query.keyword; //gets the value that is typed in the form
    let orientation = req.query.orientation; //gets the orientation of the image
    let parsedData = await getImages(keyword, orientation);
    parsedData.hits = shuffle(parsedData.hits);
    res.render("results", {"images":parsedData.hits});
});

//starting server
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Express server is running..."); 
});

function getImages(keyword, orientation){
    return new Promise(function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword+'&orientation='+orientation, function (error, response, body){
            if(!error && response.statusCode == 200) {
                let parsedData = JSON.parse(body);
                resolve(parsedData);
            } else {
                reject();
                console.log(response.statusCode);
                console.log(error);
            }
        });  
    });
}