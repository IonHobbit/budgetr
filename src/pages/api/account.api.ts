import axios from 'axios'
import { CreateAccountRequest } from "@/interfaces/requests.interface";
import { writeToFirestore } from "@/utils/firebase.util";
import { BankAPIResponse } from '@/interfaces/response.interface';
import { IBank } from '@/models/account';

export const createAccount = async (userID: string, account: CreateAccountRequest) => {
  const payload = Object.assign({}, account) as any;

  const response = await writeToFirestore(`Users/${userID}/Accounts`, payload)
  return response
}

export const fetchBanks = async (): Promise<IBank[]> => {
  const response = await axios.get('https://nigerianbanks.xyz/') as BankAPIResponse

  return response.data;
}