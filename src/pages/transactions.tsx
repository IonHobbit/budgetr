import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";

import useLayout from "@/hooks/useLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "./_app";
import { selectAccounts } from "@/store/slices/accountsSlice";
import { useEffect, useMemo, useState } from "react";
import { Account } from "@/models/account";
import { Transaction, TransactionType } from "@/models/transaction";
import Table from "@/components/Table";
import { TRANSACTION_TYPES } from "@/constants/constants";
import helperUtil from "@/utils/helper.util";
import EmptyState from "@/components/EmptyState";
import { useModal } from "@/components/ModalManager";
import TransactionModal from "@/components/modals/TransactionModal";

const TransactionsPage: NextPageWithLayout = () => {
  const accounts = useSelector((state: RootState) => selectAccounts(state));

  const [selectedType, setSelectedType] = useState(TRANSACTION_TYPES[0]);
  const [selectedAccounts, setSelectedAccounts] = useState<Array<string>>([]);

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
      .filter((transaction: Transaction) =>
        selectedAccounts.length > 0
          ? selectedAccounts?.includes(transaction.account)
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
      <div className="py-6 space-y-6 h-full">
        {accounts.length > 0 ? (
          <>
            <div className="flex items-center space-x-4">
              {TRANSACTION_TYPES.map((type: TransactionType) => {
                return (
                  <div
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded  capitalize cursor-pointer hover:bg-primary hover:text-white ${
                      selectedType == type
                        ? "bg-primary text-white"
                        : "bg-secondary text-text"
                    }`}
                  >
                    {type}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {accounts.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm">Filter by Account</p>
                  <div className="flex items-center w-full space-x-2 lg:block lg:space-y-3 lg:space-x-0">
                    {accounts.map(
                      (account: Account) => {
                        return (
                          <div
                            key={account.id}
                            onClick={() => toggleAccount(account.id)}
                            className={`px-4 py-2 rounded  capitalize cursor-pointer whitespace-nowrap overflow-hidden truncate hover:text-white ${
                              selectedAccounts.includes(account.id)
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
                      }
                    )}
                  </div>
                </div>
              )}
              <div
                className={`${
                  accounts.length > 0 ? "lg:col-span-6" : "lg:col-span-7"
                } overflow-x-auto`}
              >
                <Table
                  className="overflow-hidden"
                  data={transactions}
                  exclude={[
                    "id",
                    "type",
                    "timestamp",
                    selectedType == TransactionType.TRANSFER
                      ? ""
                      : "receivingAccount",
                  ]}
                  emptyMessage="No transactions found"
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

useLayout(DashboardLayout, TransactionsPage, "Accounts");

export default TransactionsPage;
