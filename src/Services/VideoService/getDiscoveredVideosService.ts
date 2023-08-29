import { realtime_db } from "../../infra/firebase-config";
import {
  get,
  ref,
} from "firebase/database";
import { FIREBASE_COLLECTIONS } from "../../utils/databaseSchema";

export class getDiscoveredVideosService {
  async execute() {
    let firebaseData: Array<any> = [];

    function shuffleFisherYates(array: Array<any>) {
      let i = array.length;
      while (i--) {
        const ri = Math.floor(Math.random() * i);
        [array[i], array[ri]] = [array[ri], array[i]];
      }
      return array.slice(0,12);
    }

    await get(ref(realtime_db, `${FIREBASE_COLLECTIONS.VIDEOS}`))
      .then((snapshot) => {
        firebaseData = snapshot.val();
      })
      .catch((error) => {
        console.error(error);
      });

    const array = Object.values(firebaseData);

    const randomReturn = shuffleFisherYates(array);

    return randomReturn;
  }
}
