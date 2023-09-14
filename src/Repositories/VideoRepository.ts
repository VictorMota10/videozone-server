import { Pool } from "pg";
import { VideoResponseProps } from "../interface/Video";

export class VideoRepository {
  async getVideosOfChannel(channel_id: string) {
    try {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || ""),
      });
      pool.connect();

      if (channel_id) {
        let query =
          "SELECT V.video_url, V.thumbnail_url, V.create_at, V.views, V.likes, V.dislikes, V.title, V.video_uuid_firebase, CH.logo_url";
        query += " FROM public.videos as V";
        query += " INNER JOIN public.channel as CH";
        query += " ON CH.id = V.channel_id";
        query += " WHERE V.channel_id = $1";

        let params = [channel_id];

        const videos: VideoResponseProps[] = await pool
          .query(query, params)
          .then((res: any) => {
            return res.rows;
          });

        pool.end();

        return videos;
      }

      return [];
    } catch (error) {
      console.log(error);
    }
  }

  async getDiscoverVideos() {
    try {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || ""),
      });
      pool.connect();

      let query =
        "SELECT V.video_url, V.thumbnail_url, V.create_at, V.views, V.likes, V.dislikes, V.title, V.video_uuid_firebase, V.channel_id, CH.logo_url, CH.tag_name";
      query += " FROM public.videos as V";
      query += " INNER JOIN public.channel as CH";
      query += " ON CH.id = V.channel_id";

      const videos: VideoResponseProps[] = await pool
        .query(query)
        .then((res: any) => {
          return res.rows || [];
        });

      pool.end();

      return videos ?? [];
    } catch (error) {
      console.log(error);
    }
  }
}
