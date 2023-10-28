export interface SessionCreate {
  session_uuid: string;
  title: string;
  description?: string;
  video_uuid: string;
  uuid: string;
  socket_room_uuid: string
  socket_id: string
}
