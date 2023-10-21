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

  async exists(
    sessionUUID: string,
  ) {
    try {

      let sessionData: any = await new SessionRepository().sessionExists(
        sessionUUID
      );

      return sessionData;
    } catch (error) {
      return error;
    }
  }
}
