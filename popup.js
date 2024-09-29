const POSITIVE_DATA_KEY = "positive_data";
const NEGATIVE_DATA_KEY = "negative_data";
let tab_id;

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  console.log("asking for data", tabs);
  tab_id = tabs[0].id;
  chrome.runtime.sendMessage({ action: 'get_data' }, (response) => {
    console.log('Response in popup.js:', response);
    showData(response);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('positive-button').addEventListener('click', () => {
    handleTabClick('positive');
  });
  
  document.getElementById('negative-button').addEventListener('click', () => {
    handleTabClick('negative');
  });
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("popup : request", request);
});

function showData(data){
  const positive_content = document.getElementById('positive-content');
  const negative_content = document.getElementById('negative-content');
  let index;
  for (const tweetsType in data) {
    console.log(tweetsType);
    const tweetsMap = data[tweetsType];
    console.log('tweetsMap', tweetsMap);
    index = 1;
    for (const key in tweetsMap) {
      if (tweetsMap.hasOwnProperty(key)) {
          const value = tweetsMap[key];

          const list_item = document.createElement('div');// <div class="list-item">
          list_item.className = 'list-item';
          
          const link_container = document.createElement('div');//<div class="link-container">
          link_container.className = 'link';

          const line_index = document.createElement('span');// <span class="line-index">
          line_index.className = 'line-index';
          line_index.innerText = `${index}. `;
          
        // const link_item = document.createElement('a');//<a href
        // link_item.href = item.status_link;
        // link_item.textContent = item.status_link;
          
          const link_item = document.createElement('div');//<a href
          link_item.textContent = value.url;

          //creating <div class="link-container">
          link_container.appendChild(line_index);
          link_container.appendChild(link_item);

          const date_container = document.createElement('div');//<div class="date-container">
          date_container.className = 'date-container';

          const date = document.createElement('span');//<span class="date"
          date.className = 'date';
          date.innerText = '01/12/2023';

          const time = document.createElement('span');//<span class="time">
          time.className = 'time';
          time.innerText = 'now';

          //<div class="date-container">
          date_container.appendChild(date);
          date_container.appendChild(time);

          list_item.appendChild(link_container);
          list_item.appendChild(date_container);

          if(tweetsType === POSITIVE_DATA_KEY){
            link_item.addEventListener('click', () => handlePostitveLinkClicked(value));
            positive_content.appendChild(list_item);
          }
          else if(tweetsType === NEGATIVE_DATA_KEY){
            link_item.addEventListener('click', () => handleNegativeLinkClicked(value));
            negative_content.appendChild(list_item);
          }
      }
    }
  }
}

function handleTabClick(tabName) {
  // Remove "active" class from all tabs
  
  const tabs = document.querySelectorAll('.inner-tab-btn-div');
  tabs.forEach(tab => tab.classList.remove('active'));

  const selectedTab = document.getElementById(`${tabName}-button-wrapper`);
  selectedTab.classList.add('active');

  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  // Show the selected tab content
  const selectedTabContent = document.getElementById(`${tabName}-content`);
  selectedTabContent.classList.add('active');
}


  /*chrome.storage.local.get(['isEnabled'], function(result) {
    const isEnabled = result.isEnabled;
    // Use the state accordingly
  });*/

function handleNegativeLinkClicked(tweet_details){
  console.log("tab_id: url: " ,tab_id, tweet_details);
  chrome.runtime.sendMessage({ action: 'open_report_from_popup_data', data: {tab_id: tab_id, tweet_details: tweet_details}}, (response) => {

  });
}

function handlePostitveLinkClicked(tweet_details){
  console.log("tab_id: url: " ,tab_id, tweet_details);
  chrome.runtime.sendMessage({ action: 'promote_post', data: {tab_id: tab_id, tweet_details: tweet_details}}, (response) => {

  });
}
