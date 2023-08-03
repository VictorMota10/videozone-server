import { Router, Request, Response } from "express";
import { VideoController } from "./Controllers/VideoController";
import { UserController } from "./Controllers/UserController";
import { InvitesController } from "./Controllers/InvitesController";
import { authToken } from "./Middleware/authToken";
import { ChannelController } from "./Controllers/ChannelController";

const router = Router();

const videoController = new VideoController();
const userController = new UserController();
const inviteController = new InvitesController();
const channelController = new ChannelController();

router.get("/", (request: Request, response: Response) => {
  return response.json({ message: "API is running..." });
});

router.get("/videos", videoController.getDiscoveredVideos);
router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);
router.post("/refresh-token", userController.refreshToken);
router.get("/invites/:uuid", authToken, inviteController.getInvites);
router.post("/create-channel", authToken, channelController.createChannel);

export { router };
