import { CreateBudgetRequest, EditBudgetRequest } from "@/interfaces/requests.interface";
import { updateFirestoreDocument } from "@/utils/firebase.util";
import { writeToFirestore } from "@/utils/firebase.util";

export const createBudget = async (userID: string, budget: CreateBudgetRequest) => {
  const payload = Object.assign({}, budget) as any;

  const response = await writeToFirestore(`Users/${userID}/Budgets`, payload)
  return response
}

export const editBudget = async (userID: string, budget: EditBudgetRequest) => {
  const payload = Object.assign({}, budget) as any;
  delete payload.id

  const response = await updateFirestoreDocument(`Users/${userID}/Budgets/${budget.id}`, payload)
  return response
}