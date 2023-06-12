import { Account } from "@/models/account";
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

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
}

export interface CreateAccountRequest {
  name: string;
  balance: number;
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