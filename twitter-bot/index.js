const { TwitterApi } = require('twitter-api-v2');

async function main() {
  //BearerToken should be regenerated manually using this app: https://grant.outofindex.com/twitter2
  //Select all checkboxes + grant all priveleges 
  //with client_id = UTJXa0xFWWUzN3RBbk9MWlJfQlY6MTpjaQ
  //and client_secret = SlhjL6RM_0pWW-hKtUrewm4ghq8Wp5mMGqkvaM5C95ab_UiRXh
  const bearerToken = 'N2NxcVhPM2ZaanFlZWwtQngwZE1hZzB5bmE4NVZfbEFEVm1ia0ZCTFloYzg5OjE2NzMzNzA0Nzg4MTI6MToxOmF0OjE';
  const twitterClient = new TwitterApi(bearerToken);
  const loggedUserId = (await twitterClient.currentUserV2()).data.id;
  console.log("My logged user id: ", loggedUserId);

  // ==> Track “ESTIAM” hashtag
  const tweets = await twitterClient.v2.search('#estiam', { "expansions": "author_id" });

  for await (const tweet of tweets) {

    // ==> Like every tweet with the hashtag
    console.log(await twitterClient.v2.like(loggedUserId, tweet.id));

    // ==> Retweet every post containing the hashtag 
    console.log(await twitterClient.v2.retweet(loggedUserId, tweet.id));

    // ==> Following users mentioning the hashtag with more than 100 follower

    const tweetAutherId = tweet.author_id;
    //Get paginator  on the tweetAutherId followers 
    const followersOfEstiamPaginator = await twitterClient.v2.followers(tweetAutherId, { asPaginator: true });
    //We fetch last page, meta.result_count returns the total number of followers
    const numFollower = (await followersOfEstiamPaginator.fetchLast()).meta.result_count;
    //If numFollower > 100, we follow the auther of the tweet
    if (numFollower > 100) {
      console.log(await twitterClient.v2.follow(loggedUserId, tweetAutherId));
    }
  }
}

console.log("Starting the twitter bot ...");
main();
console.log("Bot work finished.");
