import { Pool } from "pg";
import { CreateChannelPayload } from "../interface/Channel";

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
        new Date().toUTCString()
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
}
