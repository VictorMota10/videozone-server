import { verify } from "jsonwebtoken";
import { ChannelRepository } from "../../Repositories/ChannelRepository";

export class createChannelService {
  async execute(
    name: string,
    imageUrl: string,
    description: string,
    token: string
  ) {
    try {
      const { uuid } = verify(token, process.env.TOKEN_HASH || "") as {
        uuid: string;
      };
      const channelData = {
        name: name,
        imageUrl: imageUrl,
        description: description,
      };

      const channelCreated = await new ChannelRepository().createChannel(
        channelData,
        uuid
      );

      return channelCreated;
    } catch (error) {
      return error;
    }
  }
}
