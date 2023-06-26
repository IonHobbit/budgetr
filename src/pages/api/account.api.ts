import axios from 'axios'
import { CreateAccountRequest, DeleteAccountRequest, EditAccountRequest } from "@/interfaces/requests.interface";
import { deleteFirestoreDocument, updateFirestoreDocument, writeToFirestore } from "@/utils/firebase.util";
import { BankAPIResponse } from '@/interfaces/response.interface';
import { IBank } from '@/models/account';

export const createAccount = async (userID: string, account: CreateAccountRequest) => {
  const payload = Object.assign({}, account) as any;

  const response = await writeToFirestore(`Users/${userID}/Accounts`, payload)
  return response
}

export const editAccount = async (userID: string, account: EditAccountRequest) => {
  const payload = Object.assign({}, account) as any;
  delete payload.id


  const response = await updateFirestoreDocument(`Users/${userID}/Accounts/${account.id}`, payload)
  return response
}

export const deleteAccount = async (userID: string, account: DeleteAccountRequest) => {
  const response = await deleteFirestoreDocument(`Users/${userID}/Accounts/${account.id}`)
  return response
}

export const fetchBanks = async (): Promise<IBank[]> => {
  const response = await axios.get('https://nigerianbanks.xyz/') as BankAPIResponse

  return response.data;
}