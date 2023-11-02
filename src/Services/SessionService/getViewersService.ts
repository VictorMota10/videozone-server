import { SessionRepository } from "../../Repositories/SessionRepository";

export class getViewersService {
  async execute(session_uuid: string) {
    try {
      const viewers = await new SessionRepository().getViewers(
        session_uuid
      );

      return viewers;
    } catch (error) {
      return error;
    }
  }
}
