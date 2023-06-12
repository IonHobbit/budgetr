import { Transaction } from "./transaction";

export interface IBank {
  name: string;
  slug: string;
  code: string;
  ussd: string;
  logo: string;
}

export interface IAccount {
  id: string;
  balance: number;
  name: string;
  bank: IBank;
  colorCode: string;
  transactions: Array<Transaction>
}
export interface IAccountWithoutTransactions {
  id: string;
  balance: number;
  name: string;
  bank: IBank;
  colorCode: string;
}

export class Account implements IAccount {
  public id: string;
  public balance: number;
  public name: string;
  public bank: IBank;
  public colorCode: string;
  public transactions: Array<Transaction>

  constructor(account: IAccount) {
    this.id = account.id;
    this.balance = account.balance;
    this.name = account.name;
    this.bank = account.bank;
    this.colorCode = account.colorCode;
    this.transactions = account.transactions;
  }
}