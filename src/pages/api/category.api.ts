import { CreateCategoryRequest } from "@/interfaces/requests.interface";
import { writeToFirestore } from "@/utils/firebase.util";

export const createCategory = async (category: CreateCategoryRequest) => {
  const payload = Object.assign({}, category) as any;

  const response = await writeToFirestore(`Categories`, payload)
  return response
}