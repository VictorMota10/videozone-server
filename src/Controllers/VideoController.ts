import { Request, Response } from "express";
import { getDiscoveredVideosService } from "../Services/VideoService/getDiscoveredVideosService";

import Queue from "../lib/Queue";
import { getDatabase, ref, set, goOnline, goOffline } from "firebase/database";
// import { firestore_db, realtime_db } from "../infra/firebase-config";
import { FIREBASE_COLLECTIONS } from "../utils/databaseSchema";
import { v4 as uuidv4 } from "uuid";
import { firestore_db, realtime_db } from "../infra/firebase-config";

export class VideoController {
  async getDiscoveredVideos(request: Request, response: Response) {
    return response.json(await new getDiscoveredVideosService().execute());
  }

  async uploadNewVideo(request: Request, response: Response) {
    // Salvar dados do video no banco postgres
    const { files, body }: any = request;
    const uuidVideo = uuidv4();

    try {
      Queue.add("VideoUpload", {
        files: files,
        data: {
          ...body,
        },
        uuidVideo: uuidVideo,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json(error);
    }

    return response.json("Starting upload");
  }
}
