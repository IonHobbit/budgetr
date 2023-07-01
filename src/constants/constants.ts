import { BudgetCategory } from "@/models/budget"
import { CategoryType } from "@/models/category"
import { TransactionType } from "@/models/transaction"

export const ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png", "pdf"]
export const COLORS = {
  'white': '#FFFFFF',
  'text': '#4A4A52',
  'error': '#A50000',
  'success': '#1B5E20',
  'primary': '#29A9CE',
  'secondary': '#1E1E25',
  'background': '#14151A',
}
export const TRANSACTION_TYPES = [
  TransactionType.EXPENSE,
  TransactionType.INCOME,
  TransactionType.TRANSFER
]

export const CATEGORY_TYPES = [
  CategoryType.EXPENSE,
  CategoryType.INCOME,
]

export const BUDGET_CATEGORIES = [
  BudgetCategory.EXPENSES,
  BudgetCategory.INCOME,
]

export const ISSUE_LABELS = [
  { id: 'bug', name: 'Bug' },
  { id: 'feedback', name: 'Feedback' },
  { id: 'improvement', name: 'Improvement' },
]