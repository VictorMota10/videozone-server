export interface SessionCreate {
  sessionUUID: string;
  title: string;
  description?: string;
  video_uuid: string;
  uuid: string;
  socket_room_uuid: string
}
