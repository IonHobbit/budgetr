import { CreateCategoryRequest, DeleteCategoryRequest, EditCategoryRequest } from "@/interfaces/requests.interface";
import { deleteFirestoreDocument, updateFirestoreDocument, writeToFirestore } from "@/utils/firebase.util";

export const createCategory = async (userID: string, category: CreateCategoryRequest) => {
  const payload = Object.assign({}, category) as any;

  const response = await writeToFirestore(`Users/${userID}/Categories`, payload)
  return response
}

export const editCategory = async (userID: string, category: EditCategoryRequest) => {
  const payload = Object.assign({}, category) as any;
  delete payload.id

  const response = await updateFirestoreDocument(`Users/${userID}/Categories/${category.id}`, payload)
  return response
}

export const deleteCategory = async (userID: string, category: DeleteCategoryRequest) => {
  const response = await deleteFirestoreDocument(`Users/${userID}/Categories/${category.id}`)
  return response
}