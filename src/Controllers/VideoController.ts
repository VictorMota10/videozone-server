import { Request, Response } from "express";
import { getDiscoveredVideosService } from "../Services/VideoService/getDiscoveredVideosService";

export class VideoController {
  async getDiscoveredVideos(request: Request, response: Response) {
    return response.json(await new getDiscoveredVideosService().execute());
  }
}
