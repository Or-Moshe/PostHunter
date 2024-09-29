const POSITIVE_DATA_KEY = "positive_tweets_map";
const NEGATIVE_DATA_KEY = "negative_tweets_map";
const is_dark_mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const modal = {
    create_modal: () => {
        const modal_overlay = document.createElement('div');
        modal_overlay.className = 'modal-overlay';
        modal_overlay.id = 'modal-overlay-id';

        const modal_content = document.createElement('div');
        modal_content.id = "modal-content-id";
        modal_content.className = "modal-content";

        const header_section = document.createElement('div');
        header_section.className = "header-section";
        
        const close_btn = document.createElement('img');
        close_btn.className = 'close-btn';
        close_btn.src = chrome.runtime.getURL('assetes/close1437.jpg');
        close_btn.width = 20;
        close_btn.height = 20;
        close_btn.onclick = modal.close_modal;

        const title = document.createElement('div');
        title.className = "modal-title";
        title.textContent = "PostHunter";

        const draft_btn = document.createElement('div');
        draft_btn.className = "draft-btn";
        draft_btn.textContent = "Draft";

        header_section.appendChild(close_btn);
        header_section.appendChild(title);
        header_section.appendChild(draft_btn);
        modal_content.appendChild(header_section);

        const modal_body = document.createElement('div');
        modal_body.id = "modal-body-id";
        modal_body.className = "modal-body";
        
        modal_content.appendChild(modal_body);

        // const modal_generated_comm = document.createElement('div');
        // modal_generated_comm.className = "modal-content modal-generated-comm";

        // const comment_container = document.createElement('div');
        // comment_container.className = "comment-container";
        
        // const comment = document.createElement('p');
        // comment.id = "comment-id";
        // comment.textContent = "his is some text in the first container";

        // comment_container.appendChild(comment);

        // const button_container = document.createElement('div');
        // button_container.className = "button-container";

        // const copy_btn = document.createElement('button');
        // copy_btn.id = "copy-btn-id";
        // copy_btn.className = "copy-btn";
        // copy_btn.textContent = "Copy";
        // copy_btn.onclick = modal.copy_comment;

        // button_container.appendChild(copy_btn);

        // modal_generated_comm.appendChild(comment_container);
        // modal_generated_comm.appendChild(button_container);


        modal_overlay.appendChild(modal_content);
        //modal_overlay.appendChild(modal_generated_comm);

        document.body.appendChild(modal_overlay);

        modal_overlay.style.display = 'none';
    },

    create_generated_comm_box: () => {
        const modal_generated_comm = document.createElement('div');
        modal_generated_comm.className = "modal-content modal-generated-comm";

        const comment_container = document.createElement('div');
        comment_container.className = "comment-container";
        twitter_ui.show_spinner(comment_container);
    
        const comment = document.createElement('p');
        comment.id = "comment-id";
        setTimeout(() => {
            twitter_ui.close_spinner(comment_container);
            comment.textContent = "his is some text in the first container"
        },5000);
        //comment.textContent = "his is some text in the first container";
        
        comment_container.appendChild(comment);

        const button_container = document.createElement('div');
        button_container.className = "button-container";

        const copy_btn = document.createElement('button');
        copy_btn.id = "copy-btn-id";
        copy_btn.className = "copy-btn";
        copy_btn.textContent = "Copy";
        copy_btn.onclick = modal.copy_comment;

        button_container.appendChild(copy_btn);

        modal_generated_comm.appendChild(comment_container);
        modal_generated_comm.appendChild(button_container);

       // if(is_dark_mode){
         //   comment.style.color = rgb(232, 230, 227);
           // modal_generated_comm.style.background = '#333';
        //}

        return modal_generated_comm;
    },
    
    open_modal: () => {
        const modal_overlay = document.getElementById('modal-overlay-id');
        if(modal_overlay.style.display === 'none'){
            modal.create_tabs(); 
            modal.show_spinner();
            modal.create_tabs_content();
            
            modal_overlay.style.display = 'block';
        }
    },
    
    show_spinner: () => {
        const tabs_content = document.getElementById('tabs-content-id');
        twitter_ui.show_spinner(tabs_content);
    },

    close_spinner: () => {
        const tabs_content = document.getElementById('tabs-content-id');
        twitter_ui.close_spinner(tabs_content);
    },

    close_modal: () => {
        /*const negative_button_wrapper = document.getElementById("negative-button-wrapper-id");
        const positive_button_wrapper = document.getElementById("positive-button-wrapper-id");
        if(negative_button_wrapper){
            negative_button_wrapper.remove();
        }
        if(positive_button_wrapper){
            positive_button_wrapper.remove();
        }

        const positive_content = document.getElementById("positive-content-id");
        const negative_content = document.getElementById("negative-content-id");

        if(positive_content){
            positive_content.remove();
        }
        if(negative_content){
            negative_content.remove();
        }*/
        const modal_body = document.getElementById('modal-body-id');
        modal_body.innerHTML = '';

        const modal_overlay = document.getElementById('modal-overlay-id');
        modal_overlay.style.display = 'none';
    },
    
    copy_comment: () => {
        const copy_btn = document.getElementById('copy-btn-id');
        copy_btn.textContent = "Copied!";

        const comment = document.getElementById('comment-id');

        helper.copy_to_clipboard(comment.textContent);
    },

    create_tabs: () => {
        const tabs_container = document.createElement("div");
        tabs_container.id = "tabs-container-id";
        tabs_container.className = "tabs-container";

        const negative_button_wrapper = document.createElement("div");
        negative_button_wrapper.id = "negative-button-wrapper-id";
        negative_button_wrapper.className = "button-wrapper active";

        const negative_button = document.createElement("a");
        negative_button.id = "negative-button-id";
        negative_button.className = "tab-button";
        negative_button.href = "#";
        negative_button.textContent = "Negative";
        negative_button.addEventListener('click', () => modal.tab_clicked("negative"));

        const tabs_content = document.createElement("div");
        tabs_content.id = "tabs-content-id";
        tabs_content.className = "tabs-content";

        const positive_button_wrapper = document.createElement("div");
        positive_button_wrapper.id = "positive-button-wrapper-id";
        positive_button_wrapper.className = "button-wrapper";

        const positive_button = document.createElement("a");
        positive_button.id = "positive-button-id";
        positive_button.className = "tab-button";
        positive_button.href = "#";
        positive_button.textContent = "Positive";
        positive_button.addEventListener('click', () => modal.tab_clicked("positive"));
        
        negative_button_wrapper.appendChild(negative_button);
        positive_button_wrapper.appendChild(positive_button);

        tabs_container.appendChild(negative_button_wrapper);
        tabs_container.appendChild(positive_button_wrapper);

        
        const modal_body = document.getElementById('modal-body-id');
        modal_body.appendChild(tabs_container);
        modal_body.appendChild(tabs_content);
    },

    create_tabs_content: async () => {
        //let hide_spinner = false;
        const data = await twitter_logic.get_data_from_local_storage();/*{
            positive_data: local_storage_data.positive_tweets_map,
            negative_data: local_storage_data.negative_tweets_map
        };*/
        
        console.log('data', data);
        
        let positive_content = document.getElementById("positive-content-id");
        let negative_content = document.getElementById("negative-content-id");

        if(!negative_content){
            negative_content = document.createElement("div");
            negative_content.id = "negative-content-id";
            negative_content.className = "tab-content active";
        }

        if(!positive_content){
            positive_content = document.createElement("div");
            positive_content.id = "positive-content-id";
            positive_content.className = "tab-content";
        }

        for (const tweetsType in data) {
            const tweetsMap = data[tweetsType];
            for (const key in tweetsMap) {
                if (tweetsMap.hasOwnProperty(key)) {
                    //hide_spinner = true;
                    const value = tweetsMap[key];

                    const list_item = document.createElement("div");
                    list_item.className = "list-item";

                    const wrapper = document.createElement("div");
                    wrapper.className = "wrapper";

                    const by_label = document.createElement("span");
                    by_label.className = "wrapper-content";
                    by_label.textContent = "Hunterd by";

                    const imoji = document.createElement("img");
                    imoji.className = "wrapper-content";
                    imoji.src = chrome.runtime.getURL('assetes/girl_imoji.jpg');

                    const by_value = document.createElement("span");
                    by_value.className = "wrapper-content";
                    by_value.textContent = value.twitter_handle;

                    const arrow = document.createElement("img");
                    arrow.className = "wrapper-content";
                    arrow.src = chrome.runtime.getURL("assetes/blue_arrow.jpg");

                    const post_tag = document.createElement("span");
                    post_tag.className = "wrapper-content";
                    post_tag.textContent = "@SethCampbell";

                    const dot = document.createElement("span");
                    dot.className = "wrapper-content";
                    dot.innerHTML = "&#8226;";
                    
                    const time = document.createElement("span");
                    time.textContent = "14s";

                    wrapper.appendChild(by_label);
                    wrapper.appendChild(imoji);
                    wrapper.appendChild(by_value);
                    wrapper.appendChild(arrow);
                    wrapper.appendChild(post_tag);
                    wrapper.appendChild(dot);
                    wrapper.appendChild(time);

                    const link = document.createElement("div");
                    link.className = "link";
                    link.textContent = value.url;
                    link.href = value.url;
                    //link.target = '_blank';

                    list_item.appendChild(wrapper);
                    list_item.appendChild(link);

                    if(tweetsType === POSITIVE_DATA_KEY){
                        link.addEventListener('click', () => modal.handle_positive_clicked(value));
                        positive_content.appendChild(list_item);
                    }
                      else if(tweetsType === NEGATIVE_DATA_KEY){
                        link.addEventListener('click', () => modal.handle_negative_clicked(value));
                        negative_content.appendChild(list_item);
                    }
                    
                }
            }
        }

        modal.close_spinner();
        const tabs_content = document.getElementById('tabs-content-id');
        tabs_content.appendChild(positive_content);
        tabs_content.appendChild(negative_content);

    },

    tab_clicked: (tabName) => {
        // Remove "active" class from all tabs
        
        const tabs = document.querySelectorAll('.button-wrapper');
        tabs.forEach(tab => tab.classList.remove('active'));
      
        const selectedTab = document.getElementById(`${tabName}-button-wrapper-id`);
        selectedTab.classList.add('active');
      
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));
      
        // Show the selected tab content
        const selectedTabContent = document.getElementById(`${tabName}-content-id`);
        selectedTabContent.classList.add('active');
    },

    handle_positive_clicked: (value) => {
        chrome.runtime.sendMessage({ action: 'open_new_tab', data: {url: value.url, tweet_details: value, action: "promote_post"}});
    },

    handle_negative_clicked: (value) => {
        chrome.runtime.sendMessage({ action: 'open_new_tab', data: {url: value.url, tweet_details: value, action: "open_report_from_popup_data"}});
    },
}


document.addEventListener('DOMContentLoaded', function() {
    loadStyle();

});

function loadStyle() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('modal.css');
    
    // Append the link element to the document head
    document.head.appendChild(link);
}

