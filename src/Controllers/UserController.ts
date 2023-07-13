import { Request, Response } from "express";
import { signInService } from "../Services/UserService/signInService";
import { signUpService } from "../Services/UserService/signUpService";
import { UserInterface } from "../interface/User";
import { FirebaseUserInterface } from "../interface/FirebaseUser";

export class UserController {
  async signIn(request: Request, response: Response) {
    try {
      const { email, password } = request.body;

      const loginRequest = await new signInService().execute(email, password);

      if (loginRequest?.success) {
        return response.json(loginRequest);
      } else {
        return response.status(400).json(loginRequest);
      }
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async signUp(request: Request, response: Response) {
    try {
      const { username, email, password, country, birthdate } = request.body;

      const createdOnFirebase: FirebaseUserInterface =
        await new signUpService().execute(email, password);

      if (createdOnFirebase.success) {
        const firebase_uuid = createdOnFirebase.userData?.user?.uid || "";

        const userObject: UserInterface = {
          email: email,
          country: country,
          birthdate: birthdate,
          created_at: new Date().toLocaleDateString(),
          username: username,
          firebase_uuid: firebase_uuid,
          avatar_url: request.body.avatar_url || "",
        };

        const createdOnPostgres = await new signUpService().createOnPostgres(
          userObject
        );

        return createdOnPostgres?.success
          ? response.json(createdOnPostgres)
          : response.status(400).json(createdOnPostgres);
      } else {
        response.status(400).json(createdOnFirebase);
      }
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}
