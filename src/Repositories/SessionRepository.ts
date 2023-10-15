import { Pool } from "pg";
import { SessionCreate } from "../interface/Session";

export class SessionRepository {
  async createSession({
    sessionUUID,
    title,
    description = "",
    uuid,
    video_uuid,
  }: SessionCreate) {
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || ""),
    });
    pool.connect();

    const alreadyExistsSessionActiveUser =
      await this.verifyAlreadySessionActive(uuid);

    if (alreadyExistsSessionActiveUser) {
      return {
        success: false,
        error:
          "Você já possui uma sessão ativa, encerre para abrir uma nova...",
      };
    }

    let query =
      "INSERT INTO public.sessions_active(session_uuid, currently_video_uuid, title, description, creator_user_uuid, public, created_at)";
    query += " VALUES ($1, $2, $3, $4, $5, $6, $7)";

    let params = [
      sessionUUID,
      video_uuid,
      title,
      description,
      uuid,
      "1",
      new Date().toUTCString(),
    ];

    await pool
      .query(query, params)
      .then((res) => {
        return res.rows[0];
      })
      .catch((err) => {
        throw new Error(err);
      });

    query =
      "SELECT session_uuid, currently_video_uuid, title, description, created_at, creator_user_uuid from public.sessions_active ";
    query += "WHERE session_uuid = $1";

    params = [sessionUUID];

    const sessionData = await pool
      .query(query, params)
      .then((res) => {
        return res.rows[0];
      })
      .catch((err) => {
        throw new Error(err);
      });

    pool.end();

    return sessionData;
  }

  async verifyAlreadySessionActive(uuid: string) {
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
        "SELECT session_uuid, currently_video_uuid, title, description, created_at, creator_user_uuid from public.sessions_active ";
      query += "WHERE creator_user_uuid = $1";

      let params = [uuid];

      const response = await pool
        .query(query, params)
        .then((res) => {
          return res.rows[0];
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      return response || false;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
