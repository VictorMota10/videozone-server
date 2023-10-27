import { Pool } from "pg";
import { SessionCreate } from "../interface/Session";

export class SessionRepository {
  async createSession({
    sessionUUID,
    title,
    description = "",
    uuid,
    video_uuid,
    socket_room_uuid,
    socket_id,
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
        session_data: alreadyExistsSessionActiveUser,
        success: false,
        error:
          "Você já possui uma sessão ativa, encerre para abrir uma nova...",
      };
    }

    let query =
      "INSERT INTO public.sessions_active(session_uuid, currently_video_uuid, title, description, creator_user_uuid, public, created_at, socket_room_uuid) ";
    query += "VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

    let params = [
      sessionUUID,
      video_uuid,
      title,
      description,
      uuid,
      "1",
      new Date().toUTCString(),
      socket_room_uuid,
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
      "INSERT INTO public.sessions_viewers(session_uuid, user_uuid, creator, joined_at, socket_id)";
    query += " VALUES ($1, $2, $3, $4, $5)";

    params = [sessionUUID, uuid, "1", new Date().toUTCString(), socket_id];

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

  async inactivateSession(sessionUUID: string) {
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
      query += "WHERE session_uuid = $1";

      let params = [sessionUUID];

      const sessionDataToInactivate = await pool
        .query(query, params)
        .then((res) => {
          return res.rows[0];
        })
        .catch((err) => {
          throw new Error(err);
        });

      const {
        session_uuid,
        currently_video_uuid,
        title,
        description,
        created_at,
        creator_user_uuid,
      } = sessionDataToInactivate;

      query =
        "INSERT INTO public.sessions_finished(session_uuid, last_video_uuid, title, description, creator_user_uuid, created_at, finished_at, total_viewers) ";
      query += "VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";

      params = [
        session_uuid,
        currently_video_uuid,
        title,
        description,
        creator_user_uuid,
        created_at,
        new Date().toUTCString(),
        "0",
      ];

      const successInactivate = await pool
        .query(query, params)
        .then(() => {
          return true;
        })
        .catch((err) => {
          throw new Error(err);
        });

      if (successInactivate) {
        query = "DELETE FROM public.sessions_active ";
        query += "WHERE session_uuid = $1";
      }

      params = [session_uuid];

      const removeOnActive = await pool
        .query(query, params)
        .then(() => {
          return { success: true };
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      return removeOnActive;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async getSessionData(sessionUUID: string) {
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
        "SELECT SA.session_uuid, SA.currently_video_uuid, SA.title, SA.description, SA.created_at, SA.creator_user_uuid, SA.socket_room_uuid, V.video_url, C.name, C.logo_url FROM public.sessions_active SA";
      query += " INNER JOIN public.videos V";
      query += " ON V.video_uuid_firebase = SA.currently_video_uuid";
      query += " INNER JOIN public.channel C";
      query += " ON V.channel_id = C.Id";
      query += " WHERE session_uuid = $1";

      let params = [sessionUUID];

      const sessionData = await pool
        .query(query, params)
        .then((res) => {
          return res.rows[0];
        })
        .catch((err) => {
          throw new Error(err);
        });

      query =
        "SELECT U.uuid, U.username, U.avatar_url, SV.creator, SV.socket_id from public.sessions_viewers SV ";
      query += "INNER JOIN public.users U ";
      query += "ON U.uuid = SV.user_uuid ";
      query += "WHERE SV.session_uuid = $1 ";

      const viewers = await pool
        .query(query, params)
        .then((res) => {
          return res.rows;
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      const response = {
        sessionData,
        viewers,
      };

      return response || undefined;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async joinSession(userUUID: string, sessionUUID: string, socketId: string) {
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
        "SELECT SA.creator_user_uuid, SV.user_uuid, SA.socket_room_uuid, SV.socket_id, SV.creator FROM public.sessions_viewers as SV ";
      query += "INNER JOIN public.sessions_active as SA ";
      query += "ON SV.session_uuid = SA.session_uuid ";
      query += "WHERE SA.session_uuid = $1 ";

      let params: any = [sessionUUID];

      const sessionData: any = await pool
        .query(query, params)
        .then((res) => {
          return res.rows;
        })
        .catch((err) => {
          throw new Error(err);
        });

      const userAlreadyJoined = sessionData?.filter(
        (value: any) => value?.user_uuid === userUUID
      );

      const hostInfo = sessionData?.filter((value: any) => value?.creator);

      if (
        userAlreadyJoined?.length === 0 &&
        sessionData[0]?.creator_user_uuid !== userUUID
      ) {
        query =
          "INSERT INTO public.sessions_viewers(session_uuid, user_uuid, creator, joined_at, socket_id) ";
        query += "VALUES($1, $2, $3, $4, $5)";

        params = [
          sessionUUID,
          userUUID,
          "0",
          new Date().toUTCString(),
          socketId,
        ];

        await pool
          .query(query, params)
          .then(() => {
            return { success: true };
          })
          .catch((err) => {
            throw new Error(err);
          });

        query = "SELECT U.avatar_url FROM public.users U ";
        query += "WHERE U.uuid = $1 ";

        params = [userUUID];

        const avatarUrl = await pool
          .query(query, params)
          .then((res) => {
            return res.rows[0];
          })
          .catch((err) => {
            throw new Error(err);
          });

        return {
          success: true,
          socket_room_uuid: sessionData[0]?.socket_room_uuid,
          already_joined: false,
          avatar_url: avatarUrl?.avatar_url,
          host_socket_id: hostInfo[0]?.socket_id,
        };
      } else {
        query = "UPDATE public.sessions_viewers ";
        query += "SET socket_id = $1 ";
        query += "WHERE session_uuid = $2 AND user_uuid = $3 ";

        params = [socketId, sessionUUID, userUUID];

        await pool.query(query, params).catch((err) => {
          throw new Error(err);
        });
      }

      pool.end();

      return {
        success: true,
        already_joined: true,
        socket_room_uuid: sessionData[0].socket_room_uuid,
        host_socket_id: hostInfo[0]?.socket_id,
        is_host: sessionData[0]?.creator_user_uuid === userUUID,
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async sessionExists(sessionUUID: string) {
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
        "SELECT session_uuid FROM public.sessions_active WHERE session_uuid = $1 ";

      let params = [sessionUUID];

      const exists = await pool
        .query(query, params)
        .then((res) => {
          return res.rows[0];
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      if (!exists) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async removeUserSession(session_uuid: string, user_uuid: string) {
    try {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || ""),
      });
      pool.connect();

      let query = "SELECT SA.socket_room_uuid FROM public.sessions_viewers SV ";
      query += "INNER JOIN public.sessions_active SA ";
      query += "ON SA.session_uuid = SV.session_uuid ";
      query +=
        "WHERE SV.session_uuid = $1 AND SV.user_uuid = $2 AND SV.creator = 'false' ";

      let params = [session_uuid, user_uuid];

      const sessionData = await pool
        .query(query, params)
        .then((res) => {
          return res.rows[0];
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });

      query =
        "INSERT INTO public.black_list_sessions_viewers(session_uuid, user_uuid) ";
      query +=
        "SELECT $1, $2 WHERE NOT EXISTS ( SELECT session_uuid, user_uuid FROM public.black_list_sessions_viewers WHERE session_uuid = $3 AND user_uuid = $4 ) ";

      params = [session_uuid, user_uuid, session_uuid, user_uuid];

      await pool.query(query, params).catch((err) => {
        throw new Error(err);
      });

      query = "DELETE FROM public.sessions_viewers ";
      query +=
        "WHERE session_uuid = $1 AND user_uuid = $2 AND creator = 'false' ";

      params = [session_uuid, user_uuid];

      const removed = await pool
        .query(query, params)
        .then(() => {
          return true;
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      if (removed)
        return {
          success: true,
          socket_room_uuid: sessionData?.socket_room_uuid,
        };

      return { success: false };
    } catch (error) {
      return error;
    }
  }

  async validateCreatorSession(session_uuid: string, user_uuid: string) {
    try {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || ""),
      });
      pool.connect();

      let query = "SELECT creator FROM public.sessions_viewers ";
      query +=
        "WHERE session_uuid = $1 AND user_uuid = $2 AND creator = 'true' ";

      let params = [session_uuid, user_uuid];

      const sessionData = await pool
        .query(query, params)
        .then((res) => {
          return res.rows[0];
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      return sessionData?.creator;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async verifyUserCanJoin(session_uuid: string, user_uuid: string) {
    try {
      const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || ""),
      });
      pool.connect();

      let query = "SELECT * FROM public.black_list_sessions_viewers ";
      query += "WHERE session_uuid = $1 AND user_uuid = $2 ";

      let params = [session_uuid, user_uuid];

      const sessionBlackList = await pool
        .query(query, params)
        .then((res) => {
          return res.rows;
        })
        .catch((err) => {
          throw new Error(err);
        });

      pool.end();

      return sessionBlackList?.length === 0;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
