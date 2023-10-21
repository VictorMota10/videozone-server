import { verify } from "jsonwebtoken";
import { io } from "../../index";
import { SessionRepository } from "../../Repositories/SessionRepository";

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

      if (removedUser) {
        console.log(
          "dispara evento pra sala toda do usuário: ",
          removedUser?.socket_room_uuid
        );
      }

      //   if (sessionData?.success) {
      //     io.socketsJoin(socket_room_uuid);
      //   }

      return removedUser?.success;
    } catch (error) {
      return error;
    }
  }
}
