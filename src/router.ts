import { Router, Request, Response } from "express";
import { VideoController } from "./Controllers/VideoController";

const router = Router();

const videoController = new VideoController()

router.get("/", (request: Request, response: Response) => {
  return response.json({ message: "API is running..." });
});

router.get('/videos', videoController.getDiscoveredVideos)

export { router } 