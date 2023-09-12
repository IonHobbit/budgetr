import { Account, IBank } from "@/models/account";
import { IBudgetItem } from "@/models/budget";
import { CategoryType } from "@/models/category";
import { TransactionType } from "@/models/transaction";
import { Timestamp } from "firebase/firestore";

export interface CreateTransactionRequest {
  amount: number,
  category?: string,
  date: Timestamp | string,
  description?: string,
  type: TransactionType,
  receivingAccount?: Account
}

export interface EditTransactionRequest {
  id: string,
  amount: number,
  category?: string,
  date: Timestamp | string,
  description?: string,
  type: TransactionType,
  receivingAccount?: Account
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface EditCategoryRequest {
  id: string;
  name?: string;
  type?: CategoryType;
}

export interface DeleteCategoryRequest {
  id: string;
}

export interface CreateAccountRequest {
  name: string;
  balance: number;
  bank: IBank;
  colorCode: string;
}

export interface EditAccountRequest {
  id: string;
  name?: string;
  balance?: number;
  colorCode?: string;
}

export interface DeleteAccountRequest {
  id: string;
}

export interface CreateBudgetRequest {
  title: string;
  expenses: IBudgetItem[];
  income: IBudgetItem[];
  startDate: Timestamp;
  endDate: Timestamp;
  totalExpenditure: number;
  projectedIncome: number;
}

export interface EditBudgetRequest {
  id: string;
  title?: string;
  expenses?: IBudgetItem[];
  income?: IBudgetItem[];
  startDate?: Timestamp;
  endDate?: Timestamp;
  totalExpenditure: number;
  projectedIncome: number;
}

export interface CreateIssueRequest {
  title: string;
  body: string;
  labels: Array<string>;
}

export interface CreateNotificationRequest {
  subject: string;
  message: string;
  read?: boolean;
}