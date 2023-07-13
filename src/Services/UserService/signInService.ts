import { UserRepository } from "../../Repositories/UserRepository";
import { auth } from "../../infra/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

export class signInService {
  async execute(email: string, password: string) {
    let userDataFirebase;
    let errorMessage;
    let successFirebaseLogin;

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential: any) => {
        userDataFirebase = userCredential;
        successFirebaseLogin = true;
      })
      .catch((error) => {
        errorMessage = error;
        successFirebaseLogin = false;
      });

    if (successFirebaseLogin) {
      const { userDataPostgres }: any = await new UserRepository().GetUserData(
        email
      );
      return {
        userDataFirebase: userDataFirebase,
        userDataPostgres,
        success: successFirebaseLogin,
      };
    }

    return {
      errorMessage: errorMessage,
      success: false,
    };
  }
}
