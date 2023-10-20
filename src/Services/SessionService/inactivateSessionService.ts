import { SessionRepository } from "../../Repositories/SessionRepository";

export class inactivateSessionService {
  async execute(
    sessionUUID: string,
  ) {
    try {

      const sessionInactivated = await new SessionRepository().inactivateSession(
        sessionUUID
      );

      return sessionInactivated;
    } catch (error) {
      return error;
    }
  }
}
