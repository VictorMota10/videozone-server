import { verify } from "jsonwebtoken";
import { SessionRepository } from "../../Repositories/SessionRepository";
import { v4 as uuidV4 } from "uuid";

export class createSessionService {
  async execute(
    title: string,
    description: string,
    video_uuid: string,
    token: string
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
      };

      const sessionData = await new SessionRepository().createSession(
        sessionDataCreate
      );

      return sessionData;
    } catch (error) {
      return error;
    }
  }
}
