const apiUrlDomain = "https://posthunter.israelcentral.cloudapp.azure.com";

/*
Author: Or Moshe
Since: 20/12/23
Descrption: store post in db
*/
const db = { 
  hello: async() => {
    const apiUrl = apiUrlDomain;
    try {
      const response = await fetch(apiUrl);
      console.log('response:', response);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.text();
      console.log('Data received:', data);
      } catch (error) {
          console.error('Error:', error);
      }
  },

  storeDataToServer: async (tweetDetails) => {
    try {
      const apiUrl = apiUrlDomain + '/tweets';
      const request = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(tweetDetails), 
      };
      console.log('request:', request);
      const response = await fetch(apiUrl, request);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json(); // Parse the JSON response
      console.log('storeDataToServer Succeed:', data);
      return data; // Return the data to the caller
    } catch (error) {
      throw error;
    } finally {
      // Close the spinner in both success and error cases
      twitter_ui.close_spinner();
    }
  },

    /*
    Author: Or Moshe
    Since: 20/12/23
    Descrption: get posts from db
    */
    getDataFromServer: async(tweet_id) => {
      try{
        const apiUrl = apiUrlDomain + '/tweets/' + local_storage_data['user_name'];
        console.log('apiUrl:', apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json(); // Parse the JSON response
        console.log('getDataFromServer Succeed:', data);
        twitter_logic.update_local_storage_from_server(data);
        return data;
      } catch (error) {
        throw error;
      }
    },

    get_all_by_type: async(tweet_id) => {
      const apiUrl = apiUrlDomain + '/tweets/positive';
      fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        helper.handle_error(error);
      });
  }
    
}