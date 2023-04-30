import { Router, Request, Response } from "express";
import { VideoController } from "./Controllers/VideoController";
import { UserController } from "./Controllers/UserController";

const router = Router();

const videoController = new VideoController()
const userController = new UserController()

router.get("/", (request: Request, response: Response) => {
  return response.json({ message: "API is running..." });
});

router.get('/videos', videoController.getDiscoveredVideos)
router.post('/sign-in', userController.signIn)
router.post('/sign-up', userController.signUp)

export { router } 