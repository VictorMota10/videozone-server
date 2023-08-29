import { ChannelRepository } from "../../Repositories/ChannelRepository";
import { ChannelData } from "../../interface/Channel";

export class listChannelsService {
  async execute(uid: string) {
    try {
      const ChannelList: ChannelData[] | undefined =
        await new ChannelRepository().listChannels(uid);

      return ChannelList;
    } catch (error) {
      return error;
    }
  }
}
