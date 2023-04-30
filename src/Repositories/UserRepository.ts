import { Pool } from "pg";
import { UserInterface } from "../interface/User";

export class UserRepository {
  async RegisterUser(userData: UserInterface) {
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
        "INSERT INTO public.users(username, email, firebase_user_uuid, created_at, country, birthdate, avatar_url)";
      query += " VALUES ($1, $2, $3, $4, $5, $6, $7)";

      const params = [
        userData.username,
        userData.email.trim(),
        userData.firebase_uuid,
        userData.created_at,
        userData.country,
        userData.birthdate,
        userData.avatar_url,
      ];

      await pool.query(query, params).catch((e) => {
        throw "Error on create user.";
      });

      query = "SELECT MAX(Id) as id FROM public.users";
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
