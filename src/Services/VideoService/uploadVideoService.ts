import "dotenv/config";
import { storage, firestore_db } from "../../infra/firebase-config";
import { getDownloadURL } from "firebase-admin/storage";
import { FIREBASE_COLLECTIONS } from "../../utils/databaseSchema";
const fs = require("fs").promises;
import os from "os";
import path from "path";
import { VideoRepository } from "../../Repositories/VideoRepository";

export class uploadVideoService {
  async execute(uuidVideo: string, file: any) {
    if (!file) return;

    const bucket = storage.bucket();

    try {
      const fileBuffer = Buffer.from(file.buffer);
      const tempFilePath = path.join(os.tmpdir(), `${file.originalname}`);

      await fs.writeFile(tempFilePath, fileBuffer);

      const uploadOptions = {
        destination: `videos/${file.originalname}&uuid=${uuidVideo}`,
        metadata: {
          contentType: file.mimetype,
        },
      };

      await bucket.upload(tempFilePath, uploadOptions);

      await fs.unlink(tempFilePath);
      return `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/videos%2F${file.originalname}&uuid=${uuidVideo}?alt=media`;
    } catch (error) {
      console.error("Erro durante o upload:", error);
      throw Error(`Error on try upload file: ${error}`);
    }
  }

  async saveThumbFirebase(file: any, uuidVideoParent: string) {
    if (!file) return;

    const bucket = storage.bucket();

    try {
      const fileBuffer = Buffer.from(file.buffer);
      const tempFilePath = path.join(os.tmpdir(), `${file.originalname}`);

      await fs.writeFile(tempFilePath, fileBuffer);

      const uploadOptions = {
        destination: `thumbnails/${file.originalname}&uuid=${uuidVideoParent}`,
        metadata: {
          contentType: file.mimetype,
        },
      };

      await bucket.upload(tempFilePath, uploadOptions);

      await fs.unlink(tempFilePath);

      return `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/thumbnails%2F${file.originalname}&uuid=${uuidVideoParent}?alt=media`;
    } catch (error) {
      console.error("Erro durante o upload:", error);
      throw Error(`Error on try upload file: ${error}`);
    }
  }

  async createVideoOnPostgres(uuidVideo: string, data: any) {
    await new VideoRepository().createVideoUploaded(uuidVideo, data);
    return;
  }

  async updateUrlPostgres(
    uuidVideo: string,
    urlFileStorage: string,
    urlThumbStorage: string
  ) {
    await new VideoRepository().updateVideoUploaded(
      uuidVideo,
      urlFileStorage,
      urlThumbStorage
    );
    return;
  }
}
