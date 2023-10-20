import { verify } from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";

import { io } from '../../index'
import { SessionRepository } from "../../Repositories/SessionRepository";


export class createSessionService {
  async execute(
    title: string,
    description: string,
    video_uuid: string,
    token: string,
    socket_room_uuid: string
  ) {
    try {
      const { uuid } = verify(token, process.env.TOKEN_HASH || "") as {
        uuid: string;
      };

      const sessionUUID = uuidV4();

      const sessionDataCreate = {
        sessionUUID,
        title,
        description,
        uuid,
        video_uuid,
        socket_room_uuid,
      };

      const sessionData = await new SessionRepository().createSession(
        sessionDataCreate
      );

      if(sessionData){
        io.socketsJoin(socket_room_uuid)
      }

      return sessionData;
    } catch (error) {
      return error;
    }
  }
}
