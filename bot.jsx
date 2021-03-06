const twit = require('twit');
const config = require('./config.jsx');

const Twitter = new twit(config);

// >>>>>>>>>>RETWEET BOT

const retweet = () => {
    let params = {
        q: '#nodejs, #Nodejs',
        result_type: 'recent',
        lang: 'en'
    }

    Twitter.get('search/tweets', params, (err, data) => {
      // if there are no errors
        if (!err) {
          // grab ID of tweet to retweet
            let retweetId = data.statuses[0].id_str;
            // tell Twitter to retweet
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, (err, response) => {
                if (response) {
                    console.log('Retweeted some random asshat successfully');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log('Shit...tweeting dun work');
                }
            });
        }
        // if unable to search
        else {
          console.log('Shit...search dun work');
        }
    });
}

// grab and retweet as soon as app is running
retweet();
// repeat every 5 minutes
setInterval(retweet, 300000);

// >>>>>>>>>>FAVORITE BOT

// find a random tweet and fav it
const favoriteTweet = () => {
  let params = {
      q: '#nodejs, #Nodejs',
      result_type: 'recent',
      lang: 'en'
  }
  // find the tweet
  Twitter.get('search/tweets', params, (err,data) => {

    let tweet = data.statuses;
    // function to generate a random tweet
    let ranDom = (arr) => {
      let index = Math.floor(Math.random()*arr.length);
      return arr[index];
    };
     // pick a random tweet
    let randomTweet = ranDom(tweet);

    // if random tweet exists
    if (typeof randomTweet != 'undefined') {
      // tell twitter to fav
      Twitter.post('favorites/create', {id: randomTweet.id_str}, (err, response) => {
        // if there was an error while favoriting
        if (err) {
          console.log('Shit, did not favorite');
        }
        else {
          console.log('Favorited some random tweet successfully');
        }
      });
    }
  });
}
// find and favorite as soon as app is running
favoriteTweet();
// repeat every 5 minutes
setInterval(favoriteTweet, 300000);

// >>>>>>>>>>FOLLOW RESPONSE BOT

// followed callback
const followed = (event) => {
  console.log('Follow event running');
  //get their handle
  let
    name = event.source.name,
    screenName = event.source.screen_name;
  // reply to follower
  tweetNow('@' + screenName + ' Thanks for the follow!');
}

// function to tweet back to follower
const tweetNow = (tweetTxt) => {
  let tweet = {
      status: tweetTxt
  }
  Twitter.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      console.log("Error in Replying");
    }
    else {
      console.log("Gratitude shown successfully");
    }
  });
}
//set up stream
const stream = Twitter.stream('user');
// when someone followss
stream.on('follow', followed);
