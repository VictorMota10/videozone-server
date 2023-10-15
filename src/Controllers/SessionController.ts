import { Request, Response } from "express";
import { validatorRequired } from "../utils/validatorRequired";
import { responseErrorGenerator } from "../utils/responseErrorGenerator";
import { createSessionService } from "../Services/SessionService/createSessionService";

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

      const sessionCreated: any = await new createSessionService().execute(
        title,
        description,
        video_uuid,
        token
      );

      if (sessionCreated?.success === false) {
        return response
          .status(406)
          .json(responseErrorGenerator(sessionCreated.error, 406));
      }

      return response.json(sessionCreated);
    } catch (error: any) {
      return response.status(400).json(responseErrorGenerator(error, 400));
    }
  }
}
