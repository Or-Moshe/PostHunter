
const manager = {
  twitter: {
    store_username_local_storage:() => twitter_ui.store_username_local_storage(),
    get_data_from_local_storage:() => twitter_logic.get_data_from_local_storage(),
    add_buttons:() => twitter_ui.addButtonToTweets(),
    create_notification_icon: () => twitter_ui.create_notification_icon(),
    promote_post: () => twitter_ui.promote_post(),
    open_report_dialog: () => twitter_ui.open_report_dialog(),
    show_alert: () => twitter_ui.show_alert(),
    // process_video_or_photo: (videoComponent, tweetPhoto) => twitter_ui.process_video_or_photo(videoComponent, tweetPhoto),
    // show_toast: (toast_details) => twitter_ui.show_toast(toast_details),
    // close_toast: (animatedDiv) => twitter_ui.close_toast(animatedDiv),
    // close_generated_reply: (animatedDiv) => twitter_ui.close_generated_reply(animatedDiv),
  },

  facebook: {
    add_buttons:()=> facebook_ui.addButtonToTweets(),
  }

}
