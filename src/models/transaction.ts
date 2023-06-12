import { Timestamp } from "firebase/firestore";
import { Account } from "./account";

export enum TransactionType {
  EXPENSE = "expense",
  INCOME = "income",
  TRANSFER = "transfer"
}

export interface ITransaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Timestamp;
  type: TransactionType;
  account: string;
  timestamp: Timestamp;
  receivingAccount?: string
}

export class Transaction implements ITransaction {
  public id: string;
  public amount: number;
  public category: string;
  public description: string;
  public date: Timestamp;
  public type: TransactionType;
  public account: string;
  public timestamp: Timestamp;
  public receivingAccount?: string

  constructor(transaction: ITransaction, account: Account) {
    this.id = transaction.id;
    this.amount = transaction.amount;
    this.category = transaction.category;
    this.description = transaction.description || '---';
    this.date = transaction.date;
    this.type = transaction.type;
    this.account = account.id;
    this.timestamp = transaction.timestamp;
    this.receivingAccount = transaction.receivingAccount;
  }
}