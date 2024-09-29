

let messages_counter = 0;
let translateYValue = 0;

const SOCIAL_NAME = "twitter";

let global_post_details = {};
let global_is_new_tab = false;

const linkObjDemo = {
  url: "https://twitter.com/kann_news/status/1730150007993520269",
  tweet_handle: "kann_news",
  tweet_id: "1730150007993520269",
  binary_string: "",
  type: "negative"
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('contnet onMessage action', request.action);

  if (request.action === 'open_report_from_popup_data') {
    global_post_details = request.tweet_details;
    global_is_new_tab = true;
    setTimeout(manager[SOCIAL_NAME].open_report_dialog, 3000);
  }
  else if(request.action === 'promote_post'){
    global_post_details = request.tweet_details;
    global_is_new_tab = true;
    setTimeout(manager[SOCIAL_NAME].promote_post, 3000);
  }
  else if(request.action === 'open_modal'){
    //setTimeout(manager[SOCIAL_NAME].promote_post, 2000);
    //db.getDataFromServer();
    modal.open_modal();
  }
});

// Initial execution when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded');
  setTimeout(() => manager[SOCIAL_NAME].store_username_local_storage(), 2500);
  loadStyle();
  if(manager){
    //manager[SOCIAL_NAME].create_notification_icon();
    modal.create_modal();
    manager[SOCIAL_NAME].get_data_from_local_storage();
    setTimeout(() => db.getDataFromServer(), 3000);
    //manager[SOCIAL_NAME].show_alert();
  }

  // Create a new MutationObserver and specify the callback function
  const observer = new MutationObserver(handleMutations);

  // Start observing the target node for configured mutations
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
});

/*function loadStyle(){
  const styleElement = document.createElement('style');
  styleElement.innerHTML = customStyle;
  document.head.appendChild(styleElement);
}*/
function loadStyle() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('content.css');
  
  // Append the link element to the document head
  document.head.appendChild(link);

  link.href= "https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css"
  document.head.appendChild(link);
}

function handleMutations(mutations) {
  mutations.forEach(function (mutation) {
    manager[SOCIAL_NAME].add_buttons();
  });
}

/*function showLinksModal(isPositive) {
  //db.getDataFromServer();
  updatePopupData();
  chrome.runtime.sendMessage({ action: 'open_popup' }, (response) => {
    return dataFromServer;
  });

}

function updatePopupData(){
  const dataFromServer = {
    positive_data: twitter_logic.positiveTweetsMap,
    negative_data: twitter_logic.negativeTweetsMap,
  };
  chrome.runtime.sendMessage({ action: 'store_data', data: dataFromServer }, (response) => {
    return dataFromServer;
  });
}*/

/*const links = [];
let hasRun = false;

function idPost() {
  let permalinks = document.querySelectorAll('a[href*="/status/"]');

  permalinks.forEach(link => {
    const href = link.getAttribute('href');

    // Filter out URLs that don't match the pattern
    if (href.match(/^\/[^\/]+\/[^\/]+\/\d+$/)) {
      if (!links.includes(href)) {
        links.push(href);
      }
    }
  });

  chrome.storage.local.set({ twitterLinks: links }, function() {});
  hasRun = true; 
}

function checkForNewPosts() {
  if (!hasRun) {
    idPost();
  }
  hasRun = false;
}

window.addEventListener('scroll', function() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.9) {
    checkForNewPosts();
  }
});*/




// Delay execution by 5 seconds after the page loads
//setTimeout(checkForNewPosts, 5000);

//version 1 with scroling 
  
// to check: remove when the user name have only /i/ 

