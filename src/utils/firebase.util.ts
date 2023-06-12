import { auth, firestore, googleProvider, storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { randomUUID } from "crypto";

import notification from "./notification";

import { ALLOWED_FILE_TYPES } from "@/constants/constants";
import { AnyAction, Dispatch } from "redux";
import { AdditionalUserInfo, GoogleAuthProvider, User, getAdditionalUserInfo, signInWithPopup } from "firebase/auth";

export interface FirebaseUser {
  data: User;
  additionalData: AdditionalUserInfo
}

export enum DirectoryPath {
  organizationLogos = 'CRM/Organizations',
  workstationAttachments = 'CRM/Attachments',
  customerDocuments = 'CRM/Customers/Documents',
  userProfileImages = 'CRM/Users/ProfileImages',
}

export const loginWithGooglePopup = async (): Promise<FirebaseUser | void> => {
  try {
    const response = await signInWithPopup(auth, googleProvider)
    const credential = GoogleAuthProvider.credentialFromResult(response)
    const user = response.user;
    const additionalData = getAdditionalUserInfo(response)!

    return { data: user, additionalData };
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);

    console.error(errorCode, errorMessage, email, credential);
  }
}

export const writeWithCustomIDToFirestore = async (collectionPath: string, data: Object) => {
  try {
    const documentReference = doc(firestore, collectionPath)
    const response = await setDoc(documentReference, { ...data, timestamp: serverTimestamp() })
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const writeToFirestore = async (collectionPath: string, data: Object) => {
  try {
    const collectionReference = collection(firestore, collectionPath)
    const response = await addDoc(collectionReference, { ...data, timestamp: serverTimestamp() })
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const updateFirestoreDocument = async (documentPath: string, data: any) => {
  try {
    const documentReference = doc(firestore, documentPath)
    const response = await updateDoc(documentReference, { ...data, timestamp: serverTimestamp() })
    return response;
  } catch (error) {
    console.error(error);
  }
}

export const fetchFirestoreData = async (collectionName: string) => {
  try {
    const collectionReference = collection(firestore, collectionName);
    const documents = await getDocs(collectionReference)
    const data = documents.docs
      .filter((doc) => doc.exists())
      .map((doc) => ({ ...doc.data(), id: doc.id }))
    return data as any[]
  } catch (error) {
    console.error(error);
  }
}

export const fetchFirestoreDocument = async <T>(documentPath: string): Promise<T | null | undefined> => {
  try {
    const documentReference = doc(firestore, documentPath);
    const document = await getDoc(documentReference)
    if (document.exists()) {
      return ({ ...document.data(), id: document.id }) as T
    }
    return null;
  } catch (error) {
    console.error(error);
  }
}

export const subscribeToFirestoreCollection = (collectionName: string, dispatcher: Dispatch, dataSetter: (data: any) => AnyAction, callback?: () => void) => {
  const collectionReference = collection(firestore, collectionName);
  return onSnapshot(collectionReference, (snapshot) => {
    const data = snapshot.docs
      .filter((doc) => doc.exists())
      .map((doc) => ({ ...doc.data(), id: doc.id }))
    dispatcher(dataSetter(data))
    if (callback) callback()
  })
}

export const subscribeToFirestoreDocument = (collectionName: string, dispatcher: Dispatch, dataSetter: (data: any) => AnyAction, callback?: () => void) => {
  const documentReference = doc(firestore, collectionName);
  return onSnapshot(documentReference, (doc) => {
    if (doc.exists()) {
      const data = { ...doc.data(), id: doc.id }
      dispatcher(dataSetter(data))
      if (callback) callback()
    }
  })
}

// export const uploadFileToStorage = async (file: File, directory: DirectoryPath): Promise<WakandaFile | void> => {
//   const _file = new WakandaFile(file);
//   if (!ALLOWED_FILE_TYPES.includes(_file.type)) {
//     return notification.error('Invalid file type');
//   }
//   try {
//     const filePath = `${directory}/${randomUUID()}.${file.name.split(".")[1]}`;
//     const fileRef = ref(storage, filePath);
//     await uploadBytes(fileRef, file);

//     _file.url = await getDownloadURL(fileRef);
//     return _file;
//   } catch (error) {
//     console.error(error);
//   }
// }