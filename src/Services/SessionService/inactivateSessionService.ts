import { SessionRepository } from "../../Repositories/SessionRepository";

export class inactivateSessionService {
  async execute(
    session_uuid: string,
  ) {
    try {

      const sessionInactivated = await new SessionRepository().inactivateSession(
        session_uuid
      );

      return sessionInactivated;
    } catch (error) {
      return error;
    }
  }
}
