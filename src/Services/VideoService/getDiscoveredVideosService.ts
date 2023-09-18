import { VideoRepository } from "../../Repositories/VideoRepository";
import { VideoResponseProps } from "../../interface/Video";

export class getDiscoveredVideosService {
  async execute() {
    function shuffleFisherYates(array: VideoResponseProps[]) {
      let i = array.length;
      while (i--) {
        const ri = Math.floor(Math.random() * i);
        [array[i], array[ri]] = [array[ri], array[i]];
      }
      return array.slice(0, 12);
    }

    const videos: VideoResponseProps[] | undefined =
      await new VideoRepository().getDiscoverVideos();

    if (videos && videos?.length > 0) {
      const randomReturn = shuffleFisherYates(videos);
      return randomReturn;
    }

    return [];
  }
}
