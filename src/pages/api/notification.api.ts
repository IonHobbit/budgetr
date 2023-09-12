import { CreateNotificationRequest } from "@/interfaces/requests.interface";
import { User } from "@/models/user";
import { deleteFirestoreDocument, writeToFirestore } from "@/utils/firebase.util";

export const sendNotification = async (notification: CreateNotificationRequest, group: User[]) => {
  notification.read = false;

  for (const user of group) {
    await writeToFirestore(`Users/${user.id}/Notifications`, notification);
  }
}

export const clearNotifications = async (userID: string) => {
  // const response = await deleteFirestoreDocument()

}