import { TransactionType } from "./transaction";

export enum CategoryType {
  EXPENSE = "expense",
  INCOME = "income",
}

export interface ICategory {
  id: string;
  name: string;
  type: CategoryType | TransactionType;
}

export class Category implements ICategory {
  public id: string;
  public name: string;
  public type: CategoryType | TransactionType;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.type = category.type;
  }
}