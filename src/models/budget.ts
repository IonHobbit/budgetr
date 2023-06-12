export enum BudgetCategory {
  EXPENSES = "expenses",
  INCOME = "income",
}

export interface IBudgetItem {
  category: string;
  amount: number;
}

export interface IBudget {
  id: string;
  title: string;
  expenses: IBudgetItem[];
  income: IBudgetItem[];
  startDate: string;
  endDate: string;
  totalExpenditure: number;
  projectedIncome: number;
}

export class Budget implements IBudget {
  public id: string;
  public title: string;
  public expenses: IBudgetItem[];
  public income: IBudgetItem[];
  public startDate: string;
  public endDate: string;
  public totalExpenditure: number;
  public projectedIncome: number;

  constructor(budget: IBudget) {
    this.id = budget.id;
    this.title = budget.title;
    this.expenses = budget.expenses;
    this.income = budget.income;
    this.startDate = budget.startDate;
    this.endDate = budget.endDate;
    this.totalExpenditure = budget.totalExpenditure;
    this.projectedIncome = budget.projectedIncome;
  }
}