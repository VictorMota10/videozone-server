import { UserRepository } from "../../Repositories/UserRepository";
import { auth } from "../../infra/firebase-config";
import { deleteUser } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { UserInterface } from "../../interface/User";

export class signUpService {
  async execute(email: string, password: string) {
    let userData;
    let errorMessage;
    let success;

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: any) => {
        userData = userCredential;
        success = true;
      })
      .catch((error) => {
        errorMessage = error;
        success = false;
      });

    return success
      ? {
          userData: userData,
          success: success,
        }
      : {
          errorMessage: errorMessage,
          success: false,
        };
  }

  async createOnPostgres(userData: UserInterface) {
    const createdUser = await new UserRepository().RegisterUser(userData);

    if (!createdUser?.success) {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    }

    return createdUser;
  }
}
