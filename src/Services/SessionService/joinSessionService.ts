import { verify } from "jsonwebtoken";
import { SessionRepository } from "../../Repositories/SessionRepository";
import { io } from "../../index";
import { socketEvents } from "../../utils/events.map";
import { v4 as uuidV4 } from "uuid";

export class joinSessionService {
  async execute(token: string, session_uuid: string, socketId: string) {
    try {
      const { uuid, username } = verify(
        token,
        process.env.TOKEN_HASH || ""
      ) as {
        uuid: string;
        username: string;
      };

      const user_uuid = uuid;

      const canJoin = await new SessionRepository().verifyUserCanJoin(
        session_uuid,
        user_uuid
      );

      if (!canJoin) {
        throw Error("Você não pode entrar em uma sessão que foi removido");
      }

      const joinSession: any = await new SessionRepository().joinSession(
        user_uuid,
        session_uuid,
        socketId
      );

      io.socketsJoin(joinSession?.socket_room_uuid);

      if (!joinSession?.already_joined) {
        io.emit(
          socketEvents.newViewerSession,
          {
            uuid,
            username,
            creator: false,
            avatar_url: joinSession?.avatar_url || undefined,
          }
        );
      }

      if (!joinSession?.is_host) {
        io.to(joinSession?.host_socket_id).emit(
          socketEvents.getCurrentTimeOfVideoSession,
          {
            from: socketId,
          }
        );
      }

      return joinSession;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }
}
