import { verify } from "jsonwebtoken";
import { ChannelRepository } from "../../Repositories/ChannelRepository";
import {
  ChannelProps,
  ManagmentChannelResponseProps,
  ManagmentDashboardData,
} from "../../interface/Channel";

export class getChannelManagmentService {
  async execute(token: string, channel_id: string) {
    try {
      const { uuid } = verify(token, process.env.TOKEN_HASH || "") as {
        uuid: string;
      };
      let managmentChannelData: ManagmentChannelResponseProps | undefined =
        await new ChannelRepository().getManagmentDataChannel(uuid, channel_id);

      let managmentDashboardData: ManagmentDashboardData = {
        countViews: 0,
        countLikes: 0,
        countDislikes: 0,
        countVideos: 0,
      };

      if (managmentChannelData) {
        const { videos } = managmentChannelData;

        managmentDashboardData.countVideos = videos?.length || 0;

        videos?.forEach((video) => {
          managmentDashboardData.countLikes += parseInt(video.likes);
          managmentDashboardData.countDislikes += parseInt(video.dislikes);
          managmentDashboardData.countViews += parseInt(video.views);
        });
      }

      const response = {
        ...managmentChannelData,
        dashboardData: managmentDashboardData,
      };

      return response;
    } catch (error) {
      return error;
    }
  }
}
