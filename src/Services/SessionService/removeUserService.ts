import { verify } from "jsonwebtoken";
import { io } from "../../index";
import { SessionRepository } from "../../Repositories/SessionRepository";
import { socketEvents } from "../../utils/events.map";

export class removeUserSessionService {
  async execute(session_uuid: string, user_uuid: string, token: string) {
    try {
      const { uuid } = verify(token, process.env.TOKEN_HASH || "") as {
        uuid: string;
      };

      await new SessionRepository().validateCreatorSession(session_uuid, uuid);

      const removedUser: any = await new SessionRepository().removeUserSession(
        session_uuid,
        user_uuid
      );

      if (removedUser?.success) {
        io.to(removedUser?.socket_room_uuid).emit(
          socketEvents?.removeViewerSession,
          {
            user_uuid,
          }
        );
      }

      return removedUser?.success;
    } catch (error) {
      return error;
    }
  }
}
