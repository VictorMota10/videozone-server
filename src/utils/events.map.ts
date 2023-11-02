export const socketEvents = {
  newViewerSession: "new_user_joined_session",
  removeViewerSession: "removed_user_session",
  viewerLeftSession: "viewer_left_session",
  getCurrentTimeOfVideoSession: "get_current_time_video",
  askVideoTime: "ask_video_time_to_sync",
  whatTimeVideo: "what_time_video",
  responseTimeVideo: "response_time_video",
  currentTimeOfVideo: "current_time_of_video",
  receiveEventChangeStatus: "session_change_status",
  sendEventChangeStatus: "session_change_status_from_host",
  hostChangeVideoTime: "host_change_video_time",
  videoCurrentTimeUpdated: "video_current_time_update",
};
