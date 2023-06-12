import * as Yup from "yup";

export const transactionValidationSchema = Yup.object().shape({
  amount: Yup.number().required("Amount is required"),
  description: Yup.string().optional(),
  category: Yup.string().optional(),
  type: Yup.string().required("Transaction type is required"),
})

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string().required("Type is required"),
})

export const budgetValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
})

export const accountValidationSchema = Yup.object().shape({
  name: Yup.string().required("Bank Name is required"),
  balance: Yup.number().required("Balance is required"),
})