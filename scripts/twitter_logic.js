/*
Author: Or Moshe
Since: 20/12/23
Descrption: all the js logic
*/
let positive_tweets_map;
let negative_tweets_map;
let promoted_tweets_map;
let repoted_tweets_map;


let local_storage_data = {
  positive_tweets_map: {},
  negative_tweets_map: {},
  promoted_tweets_map: {},
  repoted_tweets_map: {}
};

const twitter_logic = {

    get_data_from_local_storage: async () => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get('data', (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error retrieving data from local storage:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
    
          if (!result.data) {
            console.log('No data found in local storage');
            local_storage_data['positive_tweets_map'] = {};
            local_storage_data['negative_tweets_map'] = {};
            local_storage_data['promoted_tweets_map'] = {};
            local_storage_data['repoted_tweets_map'] = {};
            console.log('local_storage_data: ', local_storage_data);
            twitter_logic.store_data_to_local_storage();
          } else {
            local_storage_data = result.data;
            console.log('local_storage_data: ', local_storage_data);
          }
    
          resolve(local_storage_data);
        });
      });
    },
    

    store_data_to_local_storage: () => {
      chrome.storage.local.set({ data: local_storage_data }, function() {
        console.log('Data saved to local storage ', local_storage_data);
      });
    },

    update_local_storage_from_server: (data) => {
      data.positive.forEach((tweet) => {
        const found = local_storage_data.promoted_tweets_map[tweet.tweet_id] || local_storage_data.positive_tweets_map[tweet.tweet_id];
        if(!found){
          local_storage_data.positive_tweets_map[tweet.tweet_id] = tweet;
        }
      });

      data.negative.forEach((tweet) => {
        const found = local_storage_data.repoted_tweets_map[tweet.tweet_id] || local_storage_data.negative_tweets_map[tweet.tweet_id];
        if(!found){
          local_storage_data.negative_tweets_map[tweet.tweet_id] = tweet;
        }
      });
      twitter_logic.store_data_to_local_storage();
    },
    /*
    Author: Or Moshe
    Since: 20/12/23
    Descrption: handle reply for positive post
    */
    update_local_storage_data: (tweet_details) => {
      if(tweet_details.type == POSITIVE){
        local_storage_data.promoted_tweets_map[tweet_details.tweet_id] = tweet_details;
        delete local_storage_data.positive_tweets_map[tweet_details.tweet_id];

        twitter_logic.store_data_to_local_storage();        
      }
      else{
        local_storage_data.repoted_tweets_map[tweet_details.tweet_id] = tweet_details;
        delete local_storage_data.negative_tweets_map[tweet_details.tweet_id];

        twitter_logic.store_data_to_local_storage();        
      }
    },

    /*
    Author: Or Moshe
    Since: 20/12/23
    Descrption: check if tweet already in arr for non duplicates
    */
    check_if_tweet_already_an_arr: (tweet_details) => {
      let positiveTweetsMap = local_storage_data.data.positive_tweets_map;
      let negativeTweetsMap = local_storage_data.data.negative_tweets_map;

      let promotedTweetsMap = local_storage_data.data.promoted_tweets_map;
      let repotedTweetsMap = local_storage_data.data.repoted_tweets_map;
        if(tweet_details.type == POSITIVE){
          const found = positiveTweetsMap[tweet_details.tweet_id] || twitter_logic.promotedTweetsMap[tweet_details.tweet_id];//positiveTweetsArr.find(e => e.tweet_id === tweet_details.tweet_id);
          if(!found){
            twitter_logic.positiveTweetsMap[tweet_details.tweet_id] = tweet_details;
          }
        }
        else{
          const found = negativeTweetsMap[tweet_details.tweet_id];
          if(!found){
            negativeTweetsMap[tweet_details.tweet_id] = tweet_details;
          }
        }
        console.log("**positiveTweetsMap: ", twitter_logic.positiveTweetsMap);
        console.log("**negativeTweetsMap: ", twitter_logic.negativeTweetsMap);
      },

      store_username: (user_name) => {
        local_storage_data['user_name'] = user_name;
        chrome.storage.local.set({ data: local_storage_data }, function() {
          console.log('user name store to local storage ', user_name);
        });
      },
}