import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { NextPageWithLayout } from "./_app";
import { RootState } from "@/store/rootReducer";

import useLayout from "@/hooks/useLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { selectAccounts } from "@/store/slices/accountsSlice";

import helperUtil from "@/utils/helper.util";
import { TRANSACTION_TYPES } from "@/constants/constants";

import Table from "@/components/Table";
import EmptyState from "@/components/EmptyState";
import { useModal } from "@/components/ModalManager";
import TransactionModal from "@/components/modals/TransactionModal";

import { Account } from "@/models/account";
import { Transaction, TransactionType } from "@/models/transaction";
import { selectCategories } from "@/store/slices/categoriesSlice";
import { Category } from "@/models/category";
import Input from "@/components/Input";
import { Icon } from "@iconify/react";

const TransactionsPage: NextPageWithLayout = () => {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const accounts = useSelector((state: RootState) => selectAccounts(state));
  const categories = useSelector((state: RootState) => selectCategories(state));

  const [selectedType, setSelectedType] = useState(TRANSACTION_TYPES[0]);
  const [dates, setDates] = useState<{ start: Date, end: Date }>({ start: firstOfMonth, end: today });
  const [selectedAccounts, setSelectedAccounts] = useState<Array<string>>([]);
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);

  const { showModal } = useModal();

  const transactions = useMemo(() => {
    const _transactions = accounts.map(
      (account: Account) => account.transactions
    );
    return _transactions
      .flat(2)
      .filter(
        (transaction: Transaction) =>
          transaction && transaction.type == selectedType
      )
      .filter((transaction: Transaction) => helperUtil.timestampToDateConverter(transaction.date).getTime() >= dates.start.getTime() && helperUtil.timestampToDateConverter(transaction.date).getTime() <= dates.end.getTime())
      .filter((transaction: Transaction) => selectedCategories.length > 0 ? selectedCategories?.includes(transaction.category) : true)
      .filter((transaction: Transaction) =>
        selectedAccounts.length > 0
          ? selectedAccounts?.includes(transaction.account) || selectedAccounts?.includes(transaction.receivingAccount || "")
          : true
      )
      .sort(
        (a: Transaction, b: Transaction) =>
          helperUtil.timestampToDateConverter(b.timestamp).getTime() -
          helperUtil.timestampToDateConverter(a.timestamp).getTime()
      )
      .sort(
        (a: Transaction, b: Transaction) =>
          helperUtil.timestampToDateConverter(b.date).getTime() -
          helperUtil.timestampToDateConverter(a.date).getTime()
      );
  }, [accounts, selectedType, selectedAccounts]);

  const toggleCategory = (category: string) => {
    const clonedCategories = [...selectedCategories];
    const duplicateIndex = clonedCategories.findIndex(
      (_category: string) => category == _category
    );
    if (duplicateIndex >= 0) {
      clonedCategories.splice(duplicateIndex, 1);
    } else {
      clonedCategories.push(category);
    }
    setSelectedCategories(clonedCategories);
  }

  const toggleAccount = (account: string) => {
    const clonedAccounts = [...selectedAccounts];
    const duplicateIndex = clonedAccounts.findIndex(
      (_account: string) => account == _account
    );
    if (duplicateIndex >= 0) {
      clonedAccounts.splice(duplicateIndex, 1);
    } else {
      clonedAccounts.push(account);
    }
    setSelectedAccounts(clonedAccounts);
  };

  return (
    <>
      <div className="py-6 space-y-6 h-full overflow-y-auto">
        {accounts.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm">
                  Showing{" "}
                  <span className="font-semibold">{transactions.length}</span>{" "}
                  transactions
                </p>
                <div className="flex items-center space-x-4">
                  {TRANSACTION_TYPES.map((type: TransactionType) => {
                    return (
                      <React.Fragment key={type}>
                        <div
                          onClick={() => { setSelectedType(type); setSelectedCategories([]); }}
                          className={`px-4 py-2 rounded  capitalize cursor-pointer hover:bg-primary hover:text-white ${selectedType == type
                            ? "bg-primary text-white"
                            : "bg-secondary text-text"
                            }`}
                        >
                          {type}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 overflow-hidden">
                <p className="text-sm">
                  Date Range
                </p>
                <div className="grid grid-cols-9 place-items-center gap-x-2">
                  <Input className="col-span-4" type="date" variation="secondary" value={helperUtil.dateFormatter(dates.start)} onChange={(value) => setDates((prev) => ({ ...prev, start: new Date(value) }))} />
                  <Icon className="text-white flex-shrink-0" icon={"solar:arrow-right-line-duotone"} />
                  <Input className="col-span-4" type="date" variation="secondary" value={helperUtil.dateFormatter(dates.end)} onChange={(value) => setDates((prev) => ({ ...prev, end: new Date(value) }))} />
                </div>
              </div>

            </div>
            {selectedType != TransactionType.TRANSFER && (
              <div className="space-y-2">
                <p className="text-sm">Filter by Category</p>
                <div className="flex items-center space-x-4 overflow-auto w-full scrollbar-hide">
                  {categories.filter((category) => category.type == selectedType).sort((a, b) => a.name.localeCompare(b.name)).map((category: Category) => {
                    return (
                      <React.Fragment key={category.id}>
                        <div
                          onClick={() => toggleCategory(category.id)}
                          className={`px-4 py-2 rounded whitespace-nowrap capitalize cursor-pointer hover:bg-primary hover:text-white ${selectedCategories.includes(category.id)
                            ? "bg-primary text-white"
                            : "bg-secondary text-text"
                            }`}
                        >
                          {category.name}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {accounts.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm">Filter by Account</p>
                  <div className="flex items-center w-full space-x-2 lg:block lg:space-y-3 lg:space-x-0">
                    {accounts.map((account: Account) => {
                      return (
                        <div
                          key={account.id}
                          onClick={() => toggleAccount(account.id)}
                          className={`px-4 py-2 rounded  capitalize cursor-pointer whitespace-nowrap overflow-hidden truncate hover:text-white ${selectedAccounts.includes(account.id)
                            ? "text-white"
                            : "bg-secondary text-text"
                            }`}
                          style={{
                            backgroundColor: selectedAccounts.includes(
                              account.id
                            )
                              ? account.colorCode
                              : "",
                          }}
                        >
                          {account.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div
                className={`${accounts.length > 0 ? "lg:col-span-6" : "lg:col-span-7"
                  } overflow-x-auto`}
              >
                <Table
                  className="overflow-hidden"
                  data={transactions}
                  arrange={[
                    "date",
                    "amount",
                    "category",
                    "description",
                    "account",
                    selectedType == TransactionType.TRANSFER
                      ? "receivingAccount"
                      : "",
                  ]}
                  emptyMessage="No transactions found"
                  onClick={(transaction: Transaction) =>
                    showModal(<TransactionModal transaction={transaction} />)
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            onClick={() => showModal(<TransactionModal />)}
            message="Your recorded transactions will show up here"
            actionText="Record a Transaction"
          />
        )}
      </div>
    </>
  );
};

useLayout(DashboardLayout, TransactionsPage, "Transactions");

export default TransactionsPage;