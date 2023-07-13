import { Router, Request, Response } from "express";
import { VideoController } from "./Controllers/VideoController";
import { UserController } from "./Controllers/UserController";
import { InvitesController } from "./Controllers/InvitesController";

const router = Router();

const videoController = new VideoController()
const userController = new UserController()
const inviteController = new InvitesController()

router.get("/", (request: Request, response: Response) => {
  return response.json({ message: "API is running..." });
});

router.get('/videos', videoController.getDiscoveredVideos)
router.post('/sign-in', userController.signIn)
router.post('/sign-up', userController.signUp)
router.get('/invites/:uuid', inviteController.getInvites)

export { router } 