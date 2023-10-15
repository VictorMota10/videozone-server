import { Router, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import os from "os";
const fs = require("fs").promises;

import { VideoController } from "./Controllers/VideoController";
import { UserController } from "./Controllers/UserController";
import { InvitesController } from "./Controllers/InvitesController";
import { authToken } from "./Middleware/authToken";
import { ChannelController } from "./Controllers/ChannelController";
import { SessionController } from "./Controllers/SessionController";

const router = Router();

const videoController = new VideoController();
const userController = new UserController();
const inviteController = new InvitesController();
const channelController = new ChannelController();
const sessionController = new SessionController();

const maxSize = 1000 * 1024 * 1024;

const upload = multer({
  dest: os.tmpdir(),
  storage: memoryStorage(),
  limits: { fileSize: maxSize },
});

const uploadMiddleware = (req: any, res: any, next: any) => {
  const allowedTypesVideo = ["video/mp4"];
  const allowedTypesThumb = ["image/jpeg", "image/png", "image/jpg"];

  // Use multer upload instance
  upload.array("files", 2)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    let files = req.files;
    const errors: any = [];
    const orderedFiles: any = [];

    files.forEach((file: any) => {
      if (allowedTypesVideo.includes(file.mimetype)) {
        orderedFiles.unshift(file);
      } else if (allowedTypesThumb.includes(file.mimetype)) {
        orderedFiles.push(file);
      }
    });

    files = orderedFiles;

    // Validate file types and sizes
    files.forEach((file: any, index: number) => {
      if (index === 0 && !allowedTypesVideo.includes(file.mimetype)) {
        errors.push(`Invalid video type: ${file.originalname}`);
      }

      if (index === 1 && !allowedTypesThumb.includes(file.mimetype)) {
        errors.push(`Invalid thumbnail type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

router.get("/", (request: Request, response: Response) => {
  return response.json({ message: "API is running..." });
});

// Videos
router.get("/videos", videoController.getDiscoveredVideos);
router.get("/video/:uuid", videoController.getByUuid);
router.post("/video/upload", uploadMiddleware, videoController.uploadNewVideo);

// Auth
router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);
router.post("/refresh-token", userController.refreshToken);

// Invites
router.get("/invites/:uuid", authToken, inviteController.getInvites);

// Channel
router.post("/channel/create", authToken, channelController.createChannel);
router.get("/channel/list", authToken, channelController.listChannelsOfUser);
router.get(
  "/channel/managment/:channel_id",
  authToken,
  channelController.getChannelManagmentInfo
);

// Sessão
router.post("/session/create", authToken, sessionController.createSession);

export { router };
