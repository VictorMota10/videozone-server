import { VideoRepository } from "../../Repositories/VideoRepository";
import { VideoResponseProps } from "../../interface/Video";

export class getVideoService {
  async UrlByUuid(uuid: string) {
    try {
      const video: VideoResponseProps | undefined =
        await new VideoRepository().getVideoByUuid(uuid);

      return video;
    } catch (error) {
      return error;
    }
  }
}
