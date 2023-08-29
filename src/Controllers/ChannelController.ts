import { Request, Response } from "express";
import { createChannelService } from "../Services/ChannelService/createChannelService";
import { listChannelsService } from "../Services/ChannelService/listChannelsService";
import { ChannelProps } from "../interface/Channel";
import { getChannelManagmentService } from "../Services/ChannelService/getChannelManagmentService";

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

  async listChannelsOfUser(request: Request, response: Response) {
    try {
      const { uid }: any = request.query;

      if (!uid)
        return response
          .status(400)
          .json({ message: "Uid of user must be sent" });

      const ChannelList: any = await new listChannelsService().execute(uid);

      return response.json(ChannelList);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async getChannelManagmentInfo(request: Request, response: Response) {
    try {
      const { channel_id }: any = request.params;
      const authToken: string = request.headers.authorization || "";
      const [, token] = authToken.split(" ");

      if (!token || !channel_id)
        return response
          .status(400)
          .json({ message: "Channel ID of user must be sent" });

      const managmentChannelData: any = await new getChannelManagmentService().execute(
        token,
        channel_id
      );

      return response.json(managmentChannelData);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
