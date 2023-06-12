import { useFormik } from "formik";
import Input from "../Input";
import Modal from "../Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { transactionValidationSchema } from "@/utils/validation-schema.util";
import Button from "../Button";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import notification from "@/utils/notification";
import { useModal } from "../ModalManager";
import { TransactionType } from "@/models/transaction";
import Select, { SelectOption } from "../Select";
import helperUtil from "@/utils/helper.util";
import { Category } from "@/models/category";
import { recordTransaction } from "@/pages/api/transactions.api";
import { fetchAccounts, selectAccounts } from "@/store/slices/accountsSlice";
import { AnyAction } from "redux";
import { Account } from "@/models/account";
import Image from "next/image";
import {
  fetchCategories,
  selectCategories,
} from "@/store/slices/categoriesSlice";
import { TRANSACTION_TYPES } from "@/constants/constants";
import useDispatcher from "@/hooks/useDispatcher";
import { selectUser } from "@/store/slices/userSlice";
import { CreateTransactionRequest } from "@/interfaces/requests.interface";

const TransactionModal: React.FC = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const accounts = useSelector((state: RootState) => selectAccounts(state));
  const categories = useSelector((state: RootState) => selectCategories(state));

  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<Account>();
  const [receivingAccount, setReceivingAccount] = useState<Account>();

  const dispatcher = useDispatcher();
  const { hideModal } = useModal();

  const transactionTypes = helperUtil.transformToSelectOptions(
    TRANSACTION_TYPES,
    ["Expense", "Income", "Transfer"]
  );

  const submitForm = async (payload: CreateTransactionRequest) => {
    if (loading) return;
    if (!account)
      return notification.warning(
        "You need to create an account to begin recording transactions"
      );
    if (payload.amount == 0)
      return notification.warning("₦0? Are you whining me??");

    if (account?.id === receivingAccount?.id)
      return notification.error(
        "Boss, you can't transfer to the same account nau."
      );
    if (payload.type !== TransactionType.TRANSFER && !payload.category)
      return notification.error("A category is required");

    payload.date = helperUtil.dateToTimestampConverter(payload.date as string);

    if (payload.type === TransactionType.TRANSFER) {
      payload.receivingAccount = receivingAccount;
      delete payload.category;
    }

    setLoading(true);

    try {
      const response = await recordTransaction(user!.id, account!, payload);
      if (response) {
        notification.success("Transaction recorded");
        dispatcher(fetchAccounts(user!.id));
      }
      setLoading(false);
      hideModal();
    } catch (error) {
      setLoading(false);
    }
  };

  const transactionForm = useFormik({
    initialValues: {
      amount: 0,
      description: "",
      category: "",
      date: helperUtil.dateFormatter(new Date()),
      type: TransactionType.EXPENSE,
    },
    validationSchema: transactionValidationSchema,
    onSubmit: async ({ amount, category, type, date, description }) =>
      submitForm({
        amount,
        date,
        category,
        type,
        description,
      }),
  });

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) {
      return helperUtil.transformToSelectOptions(
        categories.filter(
          (category: Category) => category.type == transactionForm.values.type
        )
      );
    }
    return [] as SelectOption[];
  }, [transactionForm.values.type, categories]);

  useEffect(() => {
    if (user) {
      dispatcher(fetchAccounts(user!.id));
    }
    
    dispatcher(fetchCategories());
    transactionForm.setFieldValue("category", categoryOptions[0].key);
    setAccount(accounts[0]);
  }, [user]);

  return (
    <Modal size="x-small" spacing={true}>
      <h5>Add New Transaction</h5>

      <form
        onSubmit={transactionForm.handleSubmit}
        className="flex flex-col space-y-6"
      >
        <Select
          title="Transaction Type"
          name="type"
          required={true}
          variation="secondary"
          options={transactionTypes}
          form={transactionForm}
        />
        <div className="space-y-2">
          <p className="text-sm">Select an account</p>
          <div className="flex items-center space-x-4">
            {accounts.map((_account: Account) => {
              return (
                <div
                  key={_account.id}
                  className={`w-20 h-20 relative cursor-pointer border-2 ${
                    account?.id == _account.id && "border-primary"
                  }`}
                  onClick={() => setAccount(_account)}
                >
                  <Image
                    sizes="100%"
                    fill={true}
                    src={_account.bank.logo}
                    className="object-contain"
                    alt={`${_account.name}'s logo`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {transactionForm.values.type === TransactionType.TRANSFER && (
          <div className="w-full flex flex-col items-center space-y-6">
            <Icon icon="bi:arrow-down" />
            <div className="flex items-center w-full space-x-4">
              {accounts
                .filter((_account: Account) => _account.id !== account?.id)
                .map((_account: Account) => {
                  return (
                    <div
                      key={_account.id}
                      className={`w-20 h-20 relative cursor-pointer border-2 ${
                        receivingAccount?.id == _account.id && "border-primary"
                      }`}
                      onClick={() => setReceivingAccount(_account)}
                    >
                      <Image
                        sizes="100%"
                        fill={true}
                        src={_account.bank.logo}
                        className="object-contain"
                        alt={`${_account.name}'s logo`}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <Input
          title={`How much did you 
          ${transactionForm.values.type == TransactionType.INCOME ? "get?" : ""}
          ${
            transactionForm.values.type == TransactionType.EXPENSE
              ? "spend?"
              : ""
          }
          ${
            transactionForm.values.type == TransactionType.TRANSFER
              ? "send?"
              : ""
          }`}
          name="amount"
          type="number"
          required={true}
          variation="secondary"
          form={transactionForm}
          placeholder="1,000,000"
        />
        {transactionForm.values.type !== TransactionType.INCOME && (
          <Input
            title="On What?"
            name="description"
            variation="secondary"
            form={transactionForm}
            placeholder="eg Snacks, Apple and Oranges"
          />
        )}
        <Input
          title="When?"
          name="date"
          type="date"
          max={helperUtil.dateFormatter(new Date())}
          required={true}
          variation="secondary"
          form={transactionForm}
        />
        <Select
          title="Category"
          name="category"
          required={true}
          variation="secondary"
          options={categoryOptions}
          form={transactionForm}
        />
        <Button loading={loading}>Create Transaction</Button>
      </form>
    </Modal>
  );
};

export default TransactionModal;
