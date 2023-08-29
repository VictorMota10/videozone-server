import { Pool } from "pg";
import { ChannelData, CreateChannelPayload, ManagmentChannelResponseProps } from "../interface/Channel";
import { VideoResponseProps } from "../interface/Video";

export class ChannelRepository {
  async createChannel(channelData: CreateChannelPayload, creator_uuid: string) {
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
        "INSERT INTO channel(user_owner_uuid, name, logo_url, description, created_at)";
      query += " VALUES ($1, $2, $3, $4, $5)";

      const params = [
        creator_uuid,
        channelData.name,
        channelData.imageUrl,
        channelData.description,
        new Date().toUTCString(),
      ];

      await pool.query(query, params).then((res) => {
        return res.rows[0];
      });

      query = "SELECT MAX(Id) as id FROM public.channel";
      const id = await pool.query(query).then((res) => {
        return res.rows[0];
      });
      pool.end();

      return id;
    } catch (error) {
      console.log(error);
    }
  }

  async listChannels(uid: string) {
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
        "SELECT id, name, logo_url, description, created_at from public.channel WHERE user_owner_uuid = $1";

      const params = [uid];

      const ChannelList: ChannelData[] | [] = await pool
        .query(query, params)
        .then((res: any) => {
          return res.rows;
        });

      pool.end();

      return ChannelList || [];
    } catch (error) {
      console.log(error);
    }
  }

  async getManagmentDataChannel(uuid: string, channel_id: string) {
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
        "SELECT ch.id, ch.name, ch.logo_url, ch.description, ch.created_at, ch.followers ";
      query += "FROM public.channel AS ch";
      query += " WHERE user_owner_uuid = $1 and id = $2";

      let params = [uuid, channel_id];

      const channelData: ChannelData = await pool
        .query(query, params)
        .then((res: any) => {
          return res.rows[0];
        });

      let responseObject: ManagmentChannelResponseProps = {
        channelData: undefined,
        videos: undefined
      };

      if (channelData.id) {
        query =
          "SELECT video_url, thumbnail_url, create_at, views, likes, dislikes, title";
        query += " FROM public.videos";
        query += " WHERE channel_id = $1";

        let params = [channel_id];

        const videos: VideoResponseProps[] = await pool
          .query(query, params)
          .then((res: any) => {
            return res.rows;
          });

        responseObject = {
          channelData: channelData,
          videos: videos,
        };
      }

      pool.end();

      return responseObject;
    } catch (error) {
      console.log(error);
    }
  }
}
