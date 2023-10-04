import { Request, Response } from "express";
import { getDiscoveredVideosService } from "../Services/VideoService/getDiscoveredVideosService";

import Queue from "../lib/Queue";
import { getDatabase, ref, set, goOnline, goOffline } from "firebase/database";
// import { firestore_db, realtime_db } from "../infra/firebase-config";
import { FIREBASE_COLLECTIONS } from "../utils/databaseSchema";
import { v4 as uuidv4 } from "uuid";
import { firestore_db, realtime_db } from "../infra/firebase-config";
import { uploadVideoService } from "../Services/VideoService/uploadVideoService";
import { getVideoService } from "../Services/VideoService/getVideoService";

export class VideoController {
  async getDiscoveredVideos(request: Request, response: Response) {
    return response.json(await new getDiscoveredVideosService().execute());
  }

  async uploadNewVideo(request: Request, response: Response) {
    const { files, body }: any = request;

    try {
      const createVideoPostgres =
        await new uploadVideoService().createVideoOnPostgres(body.uuid, body);

      if (createVideoPostgres) {
        Queue.add("VideoUpload", {
          files: files,
          data: {
            ...body,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(400).json(error);
    }

    return response.json("Starting upload");
  }

  async getUrlByUuid(request: Request, response: Response) {
    const { uuid }: any = request.params;

    if(!uuid) response.status(400).json('uuid must be sent');

    try {
      const videoData =
        await new getVideoService().UrlByUuid(uuid)

        return response.json(videoData);
    } catch (error) {
      console.log(error);
      return response.status(400).json(error);
    }
  }
}
