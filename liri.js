var inquirer = require("inquirer");
var fs = require("fs");

var apiKeys = require("./keys.js");
var twitter = require("./twitter.js");
var spotify = require("./spotify.js");
var omdb = require("./omdb.js");


inquirer
// user chooses what they want to do
.prompt([

    {
        type: "checkbox",
        message: "What would you like to do?",
        name: "userAction",
        choices: [{name: "Pull my Tweets"}, 
        {name: "Get Song Info"},
        {name: "Get Movie Info"},
        {name: "Chef's Special"}],
          
     }
])

.then(function (inquirerResponse) {
    
    // if search spotify then prompt for song title
    if (inquirerResponse.userAction.indexOf("Get Song Info") > -1) {
        inquirer
            .prompt([{
                type: "input",
                message: "Which Song are You looking For?",
                name: "spotifySong"
            }])
            .then(function (inquirerSpotifyResponse) {
                //call function in spotify.js
                //arguments: apiKeys, random.txt song, song limit, DON'T print full song url
                spotify.searchSong(apiKeys, inquirerSpotifyResponse.spotifySong, 5, false);

            })
    }

    //invoke twitter function
    // console.log(inquirerResponse.userAction);
    if (inquirerResponse.userAction.indexOf("Pull my Tweets") > -1) {
        twitter.getTweets(apiKeys);
    }

    if (inquirerResponse.userAction.indexOf("Get Movie Info") > -1) {
        //if search Movies then prompt for movie title
        inquirer
            .prompt([{
                type: "input",
                message: "What movie are you searching for?",
                name: "movieTitle"
            }])

           
            .then(function (inquirerMovieResponse) {
                omdb.searchMovie(inquirerMovieResponse.movieTitle);
                

            })
            // if (inquirerMovieResponse.movieTitle === undefined) {
            // function (inquirerMovieResponse) {
            //     omdb.searchMovie("Mr. Nobody");
            // }
            
            .catch(function (err) {
                console.log(err);
            });
    }

    //if user selects Surprise Me choice the song in the Random.txt file will be consoled
    if (inquirerResponse.userAction.indexOf("Chef's Special") > -1) {

        fs.readFile("random.text", "utf8", function (error, data) {
            if (error) throw error

            //arguments: apiKeys, random.txt song, song limit, print full song url
            spotify.searchSong(apiKeys, data, 1, true);

        })
    }
});