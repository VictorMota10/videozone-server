import { VideoResponseProps } from "../../interface/Video";
import { VideoRepository } from "../../Repositories/VideoRepository";

export class getVideoChannelService {
  async execute(channel_id: string) {
    try {
      const videos: VideoResponseProps[] | undefined =
        await new VideoRepository().getVideosOfChannel(channel_id);

      return videos;
    } catch (error) {
      return error;
    }
  }
}
