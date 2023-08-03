import { Pool } from "pg";
import { UserInterface } from "../interface/User";

export class InviteRepository {
  async GetUserInvites(email: string) {
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
        "SELECT username, country, avatar_url, birthdate, id FROM public.sessions_invites WHERE user_receiver_uuid = $1";
      const userDataPostgres = await pool.query(query, [email]).then((res) => {
        return res.rows[0];
      });

      pool.end();

      return { userDataPostgres };
    } catch (error) {
      console.log(error);
    }
  }
}
