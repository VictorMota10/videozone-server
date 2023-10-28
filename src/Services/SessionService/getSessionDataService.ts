import { SessionRepository } from "../../Repositories/SessionRepository";

export class getSessionDataService {
  async execute(
    session_uuid: string,
  ) {
    try {

      let sessionData = await new SessionRepository().getSessionData(
        session_uuid
      );

      return sessionData;
    } catch (error) {
      return error;
    }
  }

  async exists(
    session_uuid: string,
  ) {
    try {

      let sessionData: any = await new SessionRepository().sessionExists(
        session_uuid
      );

      return sessionData;
    } catch (error) {
      return error;
    }
  }
}
