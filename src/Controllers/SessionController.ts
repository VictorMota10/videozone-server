import { Request, Response } from "express";
import { validatorRequired } from "../utils/validatorRequired";
import { responseErrorGenerator } from "../utils/responseErrorGenerator";
import { createSessionService } from "../Services/SessionService/createSessionService";
import { inactivateSessionService } from "../Services/SessionService/inactivateSessionService";
import { getSessionDataService } from "../Services/SessionService/getSessionDataService";
import { joinSessionService } from "../Services/SessionService/joinSessionService";

import { v4 as uuidv4 } from "uuid";

export class SessionController {
  async createSession(request: Request, response: Response) {
    try {
      const { video_uuid, title, description } = request.body;

      const validation = validatorRequired(request.body, [
        "title",
        "video_uuid",
      ]);

      if (!validation.success) {
        throw new Error(validation.failedMessage);
      }

      const authToken: string = request.headers.authorization || "";
      const [, token] = authToken.split(" ");

      let socket_room_uuid = uuidv4()

      const sessionCreated: any = await new createSessionService().execute(
        title,
        description,
        video_uuid,
        token,
        socket_room_uuid
      );

      if (sessionCreated?.success === false) {
        return response.status(406).json(sessionCreated);
      }

      return response.json(sessionCreated);
    } catch (error: any) {
      return response.status(400).json(responseErrorGenerator(error, 400));
    }
  }

  async inactivateSession(request: Request, response: Response) {
    try {
      const { session_uuid } = request.body;

      const inactivateSession: any =
        await new inactivateSessionService().execute(session_uuid);

      return response.json(inactivateSession);
    } catch (error: any) {
      return response.status(400).json(responseErrorGenerator(error, 400));
    }
  }

  async getSessionData(request: Request, response: Response) {
    try {
      const { session_uuid } = request.params;

      const authToken: string = request.headers.authorization || "";
      const [, token] = authToken.split(" ");

      const sessionData: any = await new getSessionDataService().execute(
        session_uuid
      );

      const joinSession: any = await new joinSessionService().execute(
        token,
        session_uuid
      );

      if (!sessionData) {
        return response.status(404).json({
          error: "Sessão não encontrada...",
        });
      }

      if (joinSession) {
        return response.json(sessionData);
      }
    } catch (error: any) {
      return response.status(400).json(responseErrorGenerator(error, 400));
    }
  }
}
