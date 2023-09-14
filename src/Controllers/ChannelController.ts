import { Request, Response } from "express";
import { createChannelService } from "../Services/ChannelService/createChannelService";
import { listChannelsService } from "../Services/ChannelService/listChannelsService";
import { ChannelProps, ManagmentDashboardData } from "../interface/Channel";
import { getChannelManagmentService } from "../Services/ChannelService/getChannelManagmentService";
import { VideoResponseProps } from "../interface/Video";
import { getVideoChannelService } from "../Services/VideoService/getVideosChannelService";
import { validatorRequired } from "../utils/validatorRequired";
import { responseErrorGenerator } from "../utils/responseErrorGenerator";

export class ChannelController {
  async createChannel(request: Request, response: Response) {
    try {
      const { name, imageUrl, description, tagName } = request.body;

      const validation = validatorRequired(request.body, ["name"]);

      console.log(validation);

      if (!validation.success) {
        throw new Error(validation.failedMessage);
      }

      const authToken: string = request.headers.authorization || "";
      const [, token] = authToken.split(" ");

      const channelCreated: any = await new createChannelService().execute(
        name,
        imageUrl,
        description,
        token,
        tagName
      );

      return response.json(channelCreated);
    } catch (error: any) {
      return response.status(400).json(responseErrorGenerator(error, 400));
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

      const managmentChannelData: any =
        await new getChannelManagmentService().execute(token, channel_id);

      if (managmentChannelData) {
        const videosOfChannel: VideoResponseProps[] =
          (await new getVideoChannelService().execute(
            channel_id
          )) as VideoResponseProps[];

        const responseObject = {
          channelData: managmentChannelData,
          videos: videosOfChannel,
        };

        return response.json(responseObject);
      }

      return response.status(400).json("Channel not found");
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
