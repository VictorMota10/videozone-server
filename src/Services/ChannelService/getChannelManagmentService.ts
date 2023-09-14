import { verify } from "jsonwebtoken";
import { ChannelRepository } from "../../Repositories/ChannelRepository";
import {
  ChannelData,
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

      const ChannelData =
        (await new ChannelRepository().getManagmentDataChannel(
          uuid,
          channel_id
        )) as ChannelData;

      return ChannelData;
    } catch (error) {
      return error;
    }
  }
}
