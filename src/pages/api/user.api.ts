import { User } from "@/models/user";
import { FirebaseUser, fetchFirestoreDocument, writeToFirestore, writeWithCustomIDToFirestore } from "@/utils/firebase.util";

export const register = async (user: FirebaseUser) => {
  const userPayload = {
    firstName: user.additionalData.profile?.given_name as string || (user.additionalData.profile?.name as string)?.split(" ")[0] || user.data.displayName?.split(" ")[0],
    lastName: user.additionalData.profile?.family_name as string || (user.additionalData.profile?.name as string)?.split(" ")[1] || user.data.displayName?.split(" ")[1],
    email: user.data.email,
  }
  await writeWithCustomIDToFirestore(`Users/${user.data.uid}`, userPayload);
  const _user = await fetchUser(user.data.uid)
  return _user;
}

export const fetchUser = async (userID: string) => {
  const response = await fetchFirestoreDocument(`Users/${userID}`)
  return response as User
}