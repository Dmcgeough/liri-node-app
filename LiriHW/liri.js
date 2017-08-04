var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var OMDB = require("request")
var command = process.argv[2];
var fs = require("fs");
var query = "";
for (var i = 3; i < process.argv.length; i++) {
    query += process.argv[i] + " ";
};

function runLiri() {

    if (command === "spotify-this-song") {
        
        
        console.log("Song Name: " + query);


        var spotify = new Spotify({
            id: keys.spotifyKeys.consumer_key,
            secret: keys.spotifyKeys.consumer_secret
        });

        spotify.search({ type: 'track', query: query, limit: 10 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            console.log(JSON.stringify("Artist: " + data.tracks.items[0].album.artists[0].name, null, 2));
            console.log(JSON.stringify("Album: " + data.tracks.items[0].album.name, null, 2));
            console.log(JSON.stringify("Preview: " + data.tracks.items[0].preview_url, null, 2));
        });
    }



    else if (command === "my-tweets") {
        


        var client = new Twitter({
            consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret
        });

        var params = { Manfredjensen: 'nodejs' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var j = 0; j < tweets.length; j++)
                    console.log(JSON.stringify("Tweets: " + tweets[j].text, null, 2));
            }
        });
    }

    else if (command === "movie-this") {
        


        OMDB(' https://www.omdbapi.com/?t=' + query + '&plot=short&apikey=40e9cece', function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            var data = JSON.parse(body);
            console.log("Title: " + data.Title);
            console.log("Release Year: " + data.Year);
            console.log("IMDB Rating: " + data.Ratings[0].Source, data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Source, data.Ratings[1].Value);
            console.log("Languages: " + data.Language);
            console.log("Countries: " + data.Country);
            console.log("Actors: " + data.Actors);
            console.log("Plot: " + data.Plot);
        });
    }

    else if (command === "do-what-it-says") {
        fs.readFile('./random.txt', "utf8", function (err, data) {
            if (err) throw err;
            dataArray = data.split(",");
            command = dataArray[0];
            query = dataArray[1]
            runLiri(); 
        });
    }
    else {
        console.log(`Ooops, that is not one of my primary functions
        Please enter:
        spotify-this-song
        movie-this
        my-tweets
        OR
        do-what-it-says`);
    }
}


runLiri();