import { auth } from "../../infra/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

export class signInService {
  async execute(email: string, password: string) {
    let userData;
    let errorMessage;
    let success;

    await signInWithEmailAndPassword(auth, email, password)
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
}
