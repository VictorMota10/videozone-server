import { ChannelRepository } from "../../Repositories/ChannelRepository";
import { ChannelProps, ChannelResponseProps } from "../../interface/Channel";

export class listChannelsService {
  async execute(
    uid: string,
  ) {
    try {
      const ChannelList: ChannelResponseProps[] | undefined = await new ChannelRepository().listChannels(uid);
      const formatedChannelList: ChannelProps[] | [{}] = []

      if(ChannelList && ChannelList?.length > 0){
        ChannelList.forEach((channel: ChannelResponseProps, index: number) => {
            formatedChannelList.push({
                id: channel.id,
                name: channel.name,
                imageUrl: channel.logo_url,
                description: channel.description,
                createdAt: channel.created_at
            })
        })
      }

      return formatedChannelList;
    } catch (error) {
      return error;
    }
  }
}
