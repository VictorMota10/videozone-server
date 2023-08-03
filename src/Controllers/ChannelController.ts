import { Request, Response } from "express";
import { createChannelService } from "../Services/ChannelService/createChannelService";

export class ChannelController {
  async createChannel(request: Request, response: Response) {
    try {
      const { name, imageUrl, description } = request.body;
      const authToken: string = request.headers.authorization || "";
      const [, token] = authToken.split(" ");

      const channelCreated: any = await new createChannelService().execute(
        name,
        imageUrl,
        description,
        token
      );

      return response.json(channelCreated);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
