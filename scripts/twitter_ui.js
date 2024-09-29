const NEGATIVE = "negative";
const POSITIVE = "positive";

const toastObjDemo = {
  closing_duration_effect: 0,
  className: 'message',
  body: {}
};

const twitter_ui = {

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: add buttons to ui
  */
  addButtonToTweets: () => {
    const tweets = document.querySelectorAll('[data-testid="tweet"]');
    
        tweets.forEach(tweet => {
          // Check if the button is not already added
          if (!tweet.querySelector('.report-button')) {
            
            const reportButton = document.createElement('div');
            reportButton.className = 'general-button report-button';

            const red_flag = document.createElement('img');
            red_flag.setAttribute('src', chrome.runtime.getURL('assetes/red_empty_flag.svg'));
            red_flag.setAttribute('title', 'report tweet in Post Hunter');

            reportButton.appendChild(red_flag);

            const positiveButton = document.createElement('div');
            positiveButton.className = 'general-button positive-button';

            const green_flag = document.createElement('img');
            green_flag.setAttribute('src', chrome.runtime.getURL('assetes/green_empty_flag.svg'));
            green_flag.setAttribute('title', 'promote tweet in Post Hunter');

            positiveButton.appendChild(green_flag);
  
            red_flag.addEventListener('click', (event) => {
              event.preventDefault()
              red_flag.setAttribute('src', chrome.runtime.getURL('assetes/red_filled_flag.svg'));
              twitter_ui.handle_click(tweet, false);
            });

            green_flag.addEventListener('click', (event) => {
              event.preventDefault()
              green_flag.setAttribute('src', chrome.runtime.getURL('assetes/green_filled_flag.svg'));
              twitter_ui.handle_click(tweet, true);
            });

            // Find the container element to append the button
            const buttonsContainer = tweet.querySelector('[role="group"]');
            if (buttonsContainer) {
              const tweet_buttons = buttonsContainer.childNodes;
              if(tweet_buttons){
                tweet_buttons[3].after(reportButton);
                tweet_buttons[3].after(positiveButton);
                //tweet_buttons[4].style.marginInlineEnd = "-22px";
              }
            }
          }
      });
  },

  store_username_local_storage: () => {
    const sideNav_accountSwitcher_btn = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
    if(sideNav_accountSwitcher_btn){
        twitter_logic.store_username(sideNav_accountSwitcher_btn.getElementsByTagName('span')[4].innerText);
    }else{
      console.log("sideNav_accountSwitcher_btn didnt found");
    }
  },
  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: get base64data from video or image
  */
  process_video_or_photo: async (videoComponent, tweetPhoto) => {
    if (videoComponent) {
        const tweetVideo = videoComponent.querySelector('video');
        console.log('tweetVideo ', tweetVideo);
        const video_blob_url = tweetVideo.src;
        return null;
        /*helper.extractDataFromBlobUrl()(video_blob_url)
        .then((base64data) => {
          console.log('Base64 data:', base64data);
          return base64data;
        })
        .catch((error) => {
          helper.handle_error(error);
        });*/
    } 
  
    else if (tweetPhoto) {
        const image_url = tweetPhoto.querySelector('img').src;
        console.log('image_url ', image_url);
        helper.get_binary_string_from_url(image_url)
        .then((binary_string) => {
          console.log('binaryString:', binary_string);
          return binary_string;
        })
        .catch((error) => {
          helper.handle_error(error);
        });
      }
  },

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: show toast
  */
  show_toast: (toast_details) => {
    /*if(messages_counter > 15){
      messages_counter = 0;
      translateYValue = 0;
    }*/
    const animatedDiv = document.createElement('div');
    animatedDiv.className = 'message';
  
    /*const link = document.createElement('a');
    link.textContent = "Post has been repored! view"
    link.href = linkObj.status_link; // Set the link URL
    link.alt = " view";
    link.className = "toast-link";*/
  
    //animatedDiv.appendChild(toast_details.body);
  
    // Append the message to the document body
    document.body.appendChild(animatedDiv);
  
    // Triggering a reflow to apply the initial opacity
    void animatedDiv.offsetWidth;
    //translateYValue = translateYValue - 50;
    const translateYString = `${translateYValue}px`;
    animatedDiv.style.opacity = 1;
    animatedDiv.style.transform = `translateX(-50%) translateY(${translateYString})`;
  
    // Hide the div after a delay (e.g., 3000 milliseconds or 3 seconds)
    if(toast_details.closing_duration_effect || toast_details.closing_duration_effect > 0){
      setTimeout(() => {
        twitter_ui.close_toast(animatedDiv, closing_duration_effect);
      }, toast_details.closing_duration_effect);
    }
    return animatedDiv;
  } ,

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: close toast
  */
  close_toast: (animatedDiv) => {
    // Set opacity to 0 and translateY back to the initial position for smooth fade-out and downward movement
    animatedDiv.style.opacity = 0;
    animatedDiv.style.transform = 'translateX(-50%) translateY(100%)';
  },

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: handling buttons clicked
  */
  handle_click: async (tweet, isPositive) => {
    global_is_new_tab = false;
    const tweetText = tweet.querySelector('[data-testid="tweetText"]');
    const videoComponent = tweet.querySelector('[data-testid="videoComponent"]');
    const tweetPhoto = tweet.querySelector('[data-testid="tweetPhoto"]');
    
    let linksArr = [];
    tweet.querySelectorAll('a').forEach(a => {
      linksArr.push(a.href);
    });
  
    const status_link = linksArr.find(link => link.includes('status'));
    const profile_link = status_link.slice(0, status_link.indexOf('/status'));
  
    const tweet_details = {
      tweetText: tweetText ? tweetText.innerText : null,
      url: status_link,
      tweet_handle: profile_link,
      tweet_id: status_link.substring(status_link.lastIndexOf('/') + 1),
      type: isPositive ? POSITIVE : NEGATIVE,
    };

    twitter_ui.process_video_or_photo(videoComponent, tweetPhoto)
    .then((binaryString) => {
      tweet_details.binary_string = binaryString;
      console.log('tweet_details ', tweet_details);
      /*db.storeDataToServer(tweet_details)
      .then((result) => {
        twitter_ui.close_spinner();
      })
      .catch((error) => {
        twitter_ui.close_spinner();
      })*/
    })
    .catch((error) => {
      helper.handle_error(error);
    });
  
    if(isPositive){
      tweet.style.border = "1px solid green";
      twitter_ui.promote_post(tweet, tweet_details)
      .then(() => {
        console.log('Promotion completed!');
        //db.storeDataToServer(tweet_details);
      })
      .catch((error) => {
        console.error('Error during promotion:', error);
      });
    }
    else{
      tweet.style.border = "1px solid red";
      twitter_ui.open_report_dialog(tweet, tweet_details);
    }
    //twitter_logic.check_if_tweet_already_an_arr(tweet_details);
    
    
    //to do: call to server and do post call
  },

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: promote post
  */
  promote_post: async (tweet, tweet_details) => {
    return new Promise((resolve, reject) => {
      const is_from_modal = !tweet_details;
      if(is_from_modal){
        tweet_details = global_post_details;
      }else{
        tweet_details.twitter_handle = local_storage_data['user_name'];
      }

      tweet = tweet ? tweet : document.querySelector('[data-testid="tweet"]');

      const like_btn = tweet.querySelector('[data-testid="like"]');
      const reply_btn = tweet.querySelector('[data-testid="reply"]');
      if(!reply_btn && !like_btn){
        reject(new Error('reply button or like not found.'));
      }

      if(like_btn){
        like_btn.click();
      }
      reply_btn.click();
      
      resolve();
    })
    .then(async () => {
      const container = document.createElement('div');
      container.className = "reply-container";
  
      const textarea = document.createElement('textarea');
      textarea.id = "generated_reply_id";
      textarea.className = "reply-content";
      textarea.innerText = 'Hello, world!';
  
      const copy = document.createElement('button');
      copy.textContent = 'Copy';
      copy.className = "copy-btn";
  
      container.appendChild(textarea);
      container.appendChild(copy);
  
      toastObjDemo.body = container;
      //const animatedDiv = twitter_ui.show_toast(toastObjDemo);
      
      const generated_comm_box = modal.create_generated_comm_box();
      
      copy.addEventListener('click', () => helper.copy_to_clipboard("Hello, world!"));
      
      setTimeout(() => {
        const tweet_btn = document.querySelector('[data-testid="tweetButton"]');
        //const close_btn = tweet.querySelector('[data-testid="app-bar-close"]');
        const twitter_modal = document.querySelectorAll('[aria-labelledby="modal-header"]')[0];
        if(twitter_modal){
          twitter_modal.appendChild(generated_comm_box);
        }
        db.storeDataToServer(tweet_details)
        .then(() => {
          twitter_logic.update_local_storage_data(tweet_details);
        })
        .catch((error) => {
          helper.handle_error(error);
        })
        .finally(() => {
          //setTimeout(() => chrome.runtime.sendMessage({ action: 'close_tab' }), 1000);
        });
        
        /*if (tweet_btn) {
          tweet_btn.onclick = async () => {
            try {
              await db.storeDataToServer(tweet_details);
              twitter_logic.update_local_storage_data(tweet_details);
            } catch (error) {
              helper.handle_error(error);
            } finally {
              setTimeout(() => chrome.runtime.sendMessage({ action: 'close_tab' }), 1000);
            }
          };
        }*/
      }, 2000);
    });
  },

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: open report dialog
  */
  open_report_dialog: (tweet, tweet_details) => {
    const is_from_modal = !tweet_details;
    if(is_from_modal){
      tweet_details = global_post_details;
    }else{
      tweet_details.twitter_handle = local_storage_data['user_name'];
    }
    
    tweet = tweet ? tweet : document.querySelectorAll('[data-testid="tweet"]')[0];
    const unlike_btn = tweet.querySelector('[data-testid="unlike"]');
    if(unlike_btn){
      unlike_btn.click();
    }
    const caret_btn = tweet.querySelector('[data-testid="caret"]');
    if(caret_btn){
      caret_btn.click();
      const report_btn = document.querySelector('[data-testid="report"]');
      if(report_btn){
        const opened_dialog = new Promise(resolve => {
          report_btn.click();
          resolve();
        });
        opened_dialog.then(() => {
          twitter_ui.report_post(tweet_details);
        }).catch(error => {
          helper.handle_error(error);
        });
      }
    }
  },

  report_post: (tweet_details) => {
    /*const report_types = ["Hate", "Abuse & Harassment", "Violent Speech", "Child Safety", "Privacy", "Spam", 
                          "Suicide or self-harm", "Sensitive or disturbing media", "Deceptive identities", "Violent & hateful entities"];
    const checkboxes = document.querySelectorAll('[name="single-choice"]');*/
    setTimeout(() => {
      const next_btn = document.querySelectorAll('[data-testid="ChoiceSelectionNextButton"]')[0];
      if(!next_btn){
        console.log("next_btn didnt found!!");
        return;
      }
      next_btn.addEventListener('click', () => {
        const btn_label = next_btn.getElementsByTagName('span')[1].innerText;
        console.log(btn_label);
        setTimeout(() => {
          const submit_btn = document.querySelectorAll('[data-testid="ChoiceSelectionNextButton"]')[0];
          //const submit_label = submit_btn.getElementsByTagName('span')[1].innerText;
          //console.log(submit_label);
            submit_btn.onclick = async () => {
              try {
                console.log('Submiting');
                await db.storeDataToServer(tweet_details);
                twitter_logic.update_local_storage_data(tweet_details);
                /*setTimeout(() => {
                  const done_btn = document.querySelectorAll('[data-testid="ocfSettingsListNextButton"]')[0];
                  done_btn.onclick = () => {
                    if(global_is_new_tab){
                      setTimeout(() => chrome.runtime.sendMessage({ action: 'close_tab' }), 500);
                    }
                  }
                }, 1000);*/
              } catch (error) {
                helper.handle_error(error);
              } 
            };
        }, 1000);
      });
    }, 2000)
  },

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: close generated reply
  */
  close_generated_reply: (animatedDiv) => {
    animatedDiv.remove();
  },

  show_spinner: (container) => {
    const spinner_container = document.createElement('div');
    spinner_container.className = "spinner-container";
    spinner_container.id = "spinner-container-id";

    const spinner = document.createElement('div');
    spinner.className = "spinner";
    spinner.style.display = 'inline-block';
    
    spinner_container.appendChild(spinner);
    container.appendChild(spinner_container);
  },

  close_spinner: () => {
    const spinner = document.querySelector('.spinner');
    if(spinner){
      spinner.style.display = 'none';
    }
  },

   /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: create notification icon
  */
  create_notification_icon: () => {
    const notifications_reports_icon_container = document.createElement('div');
    notifications_reports_icon_container.id = 'notifications_reports_icon_container';
  
    /*const notifications_positives_icon_container = document.createElement('div');
    notifications_positives_icon_container.id = 'notifications_positives_icon_container';
  */
    // Create the notification icon
    const notifications_reports_icon = document.createElement('button');
    notifications_reports_icon.id = 'notifications_reports_icon';
    notifications_reports_icon.textContent = '🔔'; // Unicode bell character, replace with your icon
    notifications_reports_icon.addEventListener('click', () => modal.open_modal());
  /*
    const notifications_positive_icon = document.createElement('button');
    notifications_positive_icon.id = 'notifications_positive_icon';
    notifications_positive_icon.textContent = '🔔'; // Unicode bell character, replace with your icon
    notifications_positive_icon.addEventListener('click', () => showLinksModal(true));
  */
    // Create the badges
    const reports_badge = document.createElement('span');
    reports_badge.className = 'badge';
    reports_badge.textContent = 8;
  
    /*const positive_badge = document.createElement('span');
    positive_badge.className = 'badge';
    positive_badge.textContent = 4;
  */
    // Append the icon and badge to the container
    notifications_reports_icon_container.appendChild(notifications_reports_icon);
    notifications_reports_icon_container.appendChild(reports_badge);
  
    /*notifications_positives_icon_container.appendChild(notifications_positive_icon);
    notifications_positives_icon_container.appendChild(positive_badge);
    */
    // Append the container to the body
    document.body.appendChild(notifications_reports_icon_container);
    //document.body.appendChild(notifications_positives_icon_container);
  },

  show_alert: () => {
    twitter_ui.show_toast(toastObjDemo);
  },
}


