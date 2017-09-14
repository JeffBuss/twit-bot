const twit = require('twit');
const config = require('./config.jsx');

const Twitter = new twit(config);

// RETWEET BOT

let retweet = () => {
    let params = {
        q: '#nodejs, #Nodejs',
        result_type: 'recent',
        lang: 'en'
    }

    Twitter.get('search/tweets', params, (err, data) => {
      // if there no errors
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
