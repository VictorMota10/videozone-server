import { verify } from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";

import { io } from "../../index";
import { SessionRepository } from "../../Repositories/SessionRepository";

export class createSessionService {
  async execute(
    title: string,
    description: string,
    video_uuid: string,
    token: string,
    socket_room_uuid: string,
    socket_id: string
  ) {
    try {
      const { uuid } = verify(token, process.env.TOKEN_HASH || "") as {
        uuid: string;
      };

      const session_uuid = uuidV4();

      const sessionDataCreate = {
        session_uuid,
        title,
        description,
        uuid,
        video_uuid,
        socket_room_uuid,
        socket_id
      };

      const sessionData = await new SessionRepository().createSession(
        sessionDataCreate
      );

      if (sessionData?.success) {
        io.socketsJoin(socket_room_uuid);
      }

      return sessionData;
    } catch (error) {
      return error;
    }
  }
}
