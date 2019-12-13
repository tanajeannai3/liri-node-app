require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
moment().format();
var axios = require('axios');
var fs = require('fs');
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");
console.log(command);
console.log(term);

switch (command) {
    case "concert-this":
    case "concert":
        concertThis(term);
        break;
    case "spotify-this-song":
    case "spotify":
        spotifySong(term);
        break;
    case "movie-this":
    case "movie":
        movieThis(term);
        break;
    case "do-what-it-says":
    case "do":
        doThis(term);
        break;
};

function concertThis(term) {
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp")
    .then(function(response) {    
        for (var i = 0; i < response.data.length; i++) {
            var datetime = response.data[i].datetime; 
            var dateArr = datetime.split('T'); 
            var concertResults = 
                "--------------------------------------------------------------------" +
                    "\nVenue Name: " + response.data[i].venue.name + 
                    "\nVenue Location: " + response.data[i].venue.city +
                    "\nDate of the Event: " + moment(dateArr[0], "MM-DD-YYYY"); 
            console.log(concertResults);
        }
    })
    .catch(function (error) {
        console.log(error);
    })};

    function spotifySong(term) {
        if(!term){
            term = "Don't Stop Me Now";
        }
        spotify
        .search({ type: 'track', query: term })
        .then(function(response) {
            for (var i = 0; i < 5; i++) {
                var spotifyResults = 
                    "--------------------------------------------------------------------" +
                        "\nArtist(s): " + response.tracks.items[i].artists[0].name + 
                        "\nSong Name: " + response.tracks.items[i].name +
                        "\nAlbum Name: " + response.tracks.items[i].album.name +
                        "\nPreview Link: " + response.tracks.items[i].preview_url;
                console.log(spotifyResults);
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    }

    function movieThis(term) {
        if(!term){
            term = "The Notebook";
        }
        axios.get("https://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
                var movieResults = 
                    "--------------------------------------------------------------------" +
                        "\nMovie Title: " + response.data.Title + 
                        "\nYear of Release: " + response.data.Year +
                        "\nIMDB Rating: " + response.data.imdbRating +
                        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                        "\nCountry Produced: " + response.data.Country +
                        "\nLanguage: " + response.data.Language +
                        "\nPlot: " + response.data.Plot +
                        "\nActors/Actresses: " + response.data.Actors;
                console.log(movieResults);
        })
        .catch(function (error) {
            console.log(error);
        });   
    }
    function doThis(term) {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(',');
            spotifySong(dataArr[0], dataArr[1]);
        })
    }