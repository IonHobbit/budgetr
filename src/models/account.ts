import { Transaction } from "./transaction";

export interface IBank {
  name: string;
  slug: string;
  code: string;
  ussd: string;
  logo: string;
}

export interface ITotals {
  expenses: number;
  income: number;
  transfers: number;
}

export interface IAccount {
  id: string;
  balance: number;
  name: string;
  bank: IBank;
  colorCode: string;
  transactions: Array<Transaction>;
  expenses: Array<Transaction>;
  income: Array<Transaction>;
  transfers: Array<Transaction>;
  totals: ITotals;
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
  public expenses: Array<Transaction>
  public income: Array<Transaction>
  public transfers: Array<Transaction>
  public totals: ITotals

  constructor(account: IAccount) {
    this.id = account.id;
    this.balance = account.balance;
    this.name = account.name;
    this.bank = account.bank;
    this.colorCode = account.colorCode;
    this.transactions = account.transactions;
    this.expenses = account.expenses;
    this.income = account.income;
    this.transfers = account.transfers;
    this.totals = account.totals;
  }
}