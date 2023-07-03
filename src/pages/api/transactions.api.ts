import { CreateTransactionRequest, EditTransactionRequest } from "@/interfaces/requests.interface"
import { Account } from "@/models/account"
import { Transaction, TransactionType } from "@/models/transaction"
import { encryptDataWithKey } from "@/utils/encryption.util"
import { deleteFirestoreDocument, updateFirestoreDocument, writeToFirestore } from "@/utils/firebase.util"
import notification from "@/utils/notification"

const areFundsSufficient = (balance: number, amount: number) => {
  return balance >= amount
}

export const recordTransaction = async (userID: string, account: Account, transaction: CreateTransactionRequest) => {
  const transactionPayload = Object.assign({}, transaction) as any;
  if (transaction.receivingAccount) {
    transactionPayload.receivingAccount = transaction.receivingAccount?.id
  }

  if ((transaction.type == TransactionType.EXPENSE || transaction.type == TransactionType.TRANSFER) &&
    !areFundsSufficient(account.balance, transaction.amount)) {
    notification.error('Account balance too low for that transaction. Are you sure it happened?')
    return false
  }

  const response = await writeToFirestore(`Users/${userID}/Accounts/${account.id}/Transactions`, { data: encryptDataWithKey(userID, transactionPayload) })

  if (transaction.type == TransactionType.EXPENSE) {
    await updateAccountBalance(userID, account, -(transaction.amount))
  } else if (transaction.type == TransactionType.INCOME) {
    await updateAccountBalance(userID, account, transaction.amount)
  } else if (transaction.type == TransactionType.TRANSFER) {
    await updateAccountBalance(userID, account, -(transaction.amount))
    await updateAccountBalance(userID, transaction.receivingAccount!, transaction.amount)
  }
  return response
}

export const editTransaction = async (userID: string, account: Account, originalTransaction: Transaction, transaction: EditTransactionRequest) => {
  const transactionPayload = Object.assign({}, transaction) as any;
  delete transactionPayload.id;

  const originalBalance = transaction.type == TransactionType.INCOME ? account.balance - originalTransaction.amount : +account.balance + +originalTransaction.amount;
  const ammountDifference = originalTransaction.amount - transaction.amount;

  if (transaction.receivingAccount) {
    transactionPayload.receivingAccount = transaction.receivingAccount?.id
  }

  if ((transaction.type == TransactionType.EXPENSE || transaction.type == TransactionType.TRANSFER) &&
    !areFundsSufficient(originalBalance, transaction.amount)) {
    notification.error('Account balance too low for that transaction. Are you sure it happened?')
    return false
  }

  const response = await updateFirestoreDocument(`Users/${userID}/Accounts/${account.id}/Transactions/${transaction.id}`, { data: encryptDataWithKey(userID, transactionPayload) })

  if (transaction.type == TransactionType.EXPENSE) {
    await updateAccountBalance(userID, account, ammountDifference)
  } else if (transaction.type == TransactionType.INCOME) {
    await updateAccountBalance(userID, account, -(ammountDifference))
  } else if (transaction.type == TransactionType.TRANSFER) {
    await updateAccountBalance(userID, account, ammountDifference)
    await updateAccountBalance(userID, transaction.receivingAccount!, -(ammountDifference))
  }
  return true
}

export const deleteTransaction = async (userID: string, account: Account, transaction: EditTransactionRequest) => {
  const response = await deleteFirestoreDocument(`Users/${userID}/Accounts/${account.id}/Transactions/${transaction.id}`)

  if (transaction.type == TransactionType.EXPENSE) {
    await updateAccountBalance(userID, account, transaction.amount)
  } else if (transaction.type == TransactionType.INCOME) {
    await updateAccountBalance(userID, account, -(transaction.amount))
  } else if (transaction.type == TransactionType.TRANSFER) {
    await updateAccountBalance(userID, account, transaction.amount)
    await updateAccountBalance(userID, transaction.receivingAccount!, -(transaction.amount))
  }
  return response
}

export const updateAccountBalance = async (userID: string, account: Account, amount: number) => {
  const balance = +account.balance + +amount;
  const response = await updateFirestoreDocument(`Users/${userID}/Accounts/${account.id}`, { balance })
  return response;
}