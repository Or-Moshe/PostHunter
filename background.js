
let data, window_id, source_tab_id, action, new_tab_id, tweet_details;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
 
  console.log('action in background: ', request.action, 'source tab: ', sender.tab.id);
  console.log("request", request);
  action = request.action;  
  /*if(request.action === 'open_popup')
    chrome.windows.create({
      type: 'popup',
      focused: true,
      url: 'popup.html',
      width: 500,
      height: 500,
      left: 930
    }, (window) => {
      console.log("response", window);
      window_id = window.id;
    });

    else*/ if(request.action === 'store_data'){
      data = request.data;
    }
    
    else if(request.action === 'get_data'){
      sendResponse(data);
    }
    //from popup.js
    /*else if(request.action === 'open_report_from_popup_data'){
      const url = request.data.tweet_details ? request.data.tweet_details.url : request.data.url;
      chrome.tabs.update(source_tab_id, {url: url});
      chrome.tabs.sendMessage(source_tab_id, { action: request.action, data: request.data });
    }

    else if(request.action === 'promote_post'){
      const url = request.data.tweet_details ? request.data.tweet_details.url : request.data.url;
      chrome.tabs.update(source_tab_id, {url: url});
      chrome.tabs.sendMessage(source_tab_id, { action: request.action, data: request.data });
    }*/
    //from modal.js
    else if (request.action === 'open_new_tab') {
      action = request.data.action;
      source_tab_id = sender.tab.id;
      tweet_details = request.data.tweet_details;
      chrome.tabs.create({ url: request.data.url }, function(newTab) {
        new_tab_id = newTab.id;
      });
    }
    else if (request.action === 'close_tab') {
      chrome.tabs.remove(new_tab_id, function() { 
        chrome.tabs.update(source_tab_id, { active: true }, function(updatedTab) {
          if (chrome.runtime.lastError) {
            console.error("Error updating tab:", chrome.runtime.lastError);
          } else {
            console.log("Navigated to the previous tab and focused it:", updatedTab);
          }
        });
      });
    }
    return true;
});

chrome.webNavigation.onCompleted.addListener(function(details) {
    if (details.frameId === 0 && details.url.includes('twitter.com')){
         chrome.tabs.sendMessage(details.tabId, { action: action, tweet_details: tweet_details });
         action = undefined;
    }
    
});

chrome.action.onClicked.addListener(function(tab) {
  // Do something when the extension icon is clicked
  console.log("Extension icon clicked!", tab.id);
  chrome.tabs.sendMessage(tab.id, { action: "open_modal" });
});
