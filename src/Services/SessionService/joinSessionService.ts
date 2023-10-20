import { verify } from "jsonwebtoken";
import { SessionRepository } from "../../Repositories/SessionRepository";
import { io } from "../../index";
import { socketEvents } from "../../utils/events.map";

export class joinSessionService {
  async execute(token: string, sessionUUID: string) {
    try {
      const { uuid, username } = verify(
        token,
        process.env.TOKEN_HASH || ""
      ) as {
        uuid: string;
        username: string;
      };

      const userUUID = uuid;

      const joinSession: any = await new SessionRepository().joinSession(
        userUUID,
        sessionUUID
      );

      if (!joinSession?.already_joined) {
        io.to(joinSession?.socket_room_uuid).emit(
          socketEvents.newViewerSession,
          {
            uuid,
            username,
          }
        );
      }

      io.socketsJoin(joinSession?.socket_room_uuid);

      return joinSession;
    } catch (error) {
      return error;
    }
  }
}
