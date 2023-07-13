import { firestore_db } from "../../infra/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { Invite } from "../../interface/Invite";

export class getInvitesService {
  async execute(uuid: string) {
    try {
      let invites: Invite[] = [];
      const invitesCollectionRef = doc(firestore_db, "invites", uuid);
      const invitesResponse = (await getDoc(invitesCollectionRef))?.data();
      if (invitesResponse) {
        for (const [key, value] of Object.entries(invitesResponse)) {
          invites.push({
            session_id: key,
            ...value
          });
        }
      }
      return invites;
    } catch (error) {
      return error;
    }
  }
}
