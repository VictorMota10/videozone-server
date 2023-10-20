import { SessionRepository } from "../../Repositories/SessionRepository";

export class getSessionDataService {
  async execute(
    sessionUUID: string,
  ) {
    try {

      let sessionData = await new SessionRepository().getSessionData(
        sessionUUID
      );

      return sessionData;
    } catch (error) {
      return error;
    }
  }
}
