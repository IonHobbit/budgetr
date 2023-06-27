import { Icon } from "@iconify/react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { NextPageWithLayout } from "./_app";
import { RootState } from "@/store/rootReducer";
import { selectUser } from "@/store/slices/userSlice";

import useMeta from "@/hooks/useMeta";
import useLayout from "@/hooks/useLayout";

import DashboardLayout from "@/layouts/DashboardLayout";
import { selectAccounts } from "@/store/slices/accountsSlice";
import { selectBudgets } from "@/store/slices/budgetsSlice";
import helperUtil from "@/utils/helper.util";

import Table from "@/components/Table";
import EmptyState from "@/components/EmptyState";

import { Account } from "@/models/account";
import { Budget, IBudgetItem } from "@/models/budget";
import { Transaction, TransactionType } from "@/models/transaction";
import CategoryModal from "@/components/modals/CategoryModal";
import { useModal } from "@/components/ModalManager";
import routes from "@/constants/routes";
import { selectCategories } from "@/store/slices/categoriesSlice";
import AccountModal from "@/components/modals/AccountModal";
import BudgetModal from "@/components/modals/BudgetModal";

const DashboardPage: NextPageWithLayout = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const budgets = useSelector((state: RootState) => selectBudgets(state));
  const accounts = useSelector((state: RootState) => selectAccounts(state));
  const categories = useSelector((state: RootState) => selectCategories(state));

  const tasks: Array<{
    name: "categories" | "accounts" | "budgets";
    icon: string;
    text: string;
    modal: any;
  }> = [
    {
      icon: "solar:folder-favourite-bookmark-bold-duotone",
      text: "Setup categories",
      name: "categories",
      modal: <CategoryModal />,
    },
    {
      icon: routes[2].icon,
      text: "Setup bank accounts",
      name: "accounts",
      modal: <AccountModal />,
    },
    {
      icon: routes[3].icon,
      text: "Setup a budget",
      name: "budgets",
      modal: <BudgetModal />,
    },
  ];

  const Greeting = () => {
    let myDate = new Date();
    let hours = myDate.getHours();
    let greet;

    if (hours < 12) greet = "Go back to sleep bro!";
    else if (hours >= 12 && hours <= 17) greet = "Sup";
    else if (hours >= 17 && hours <= 24) greet = "Yo!";

    return (
      <h3>
        {greet} {user?.firstName}
      </h3>
    );
  };

  const { showModal } = useModal();
  const { getCategory } = useMeta();

  const setupTasks = useMemo(() => {
    const completedTasks = {
      budgets: budgets && budgets.length > 0,
      accounts: accounts && accounts.length > 0,
      categories: categories && categories.length > 0,
    };

    return tasks.filter((task) => {
      return !completedTasks[task.name];
    });
  }, [categories, accounts, budgets]);

  const currentBudget = useMemo(() => {
    const currentTime =
      new Date(new Date().toDateString()).getTime() + 1000 * 60 * 60;

    return budgets.find((budget: Budget) => {
      return (
        new Date(budget.startDate).getTime() <= currentTime &&
        new Date(budget.endDate).getTime() > currentTime
      );
    });
  }, [budgets]);

  const transactions = useMemo(() => {
    const allTransactions = accounts.reduce(
      (transactions: Transaction[], account: Account) => {
        return [...transactions, ...account.transactions];
      },
      []
    );

    const todaysTransactions = allTransactions.filter(
      (transaction: Transaction) =>
        helperUtil.timestampToDateConverter(transaction.date).getDate() ==
        new Date().getDate()
    );

    const latest = allTransactions
      .sort(
        (a: Transaction, b: Transaction) =>
          helperUtil.timestampToDateConverter(b.timestamp).getTime() -
          helperUtil.timestampToDateConverter(a.timestamp).getTime()
      )
      .slice(0, 10);

    const expenses = allTransactions.filter(
      (transaction: Transaction) => transaction.type === TransactionType.EXPENSE
    );
    const income = allTransactions.filter(
      (transaction: Transaction) => transaction.type === TransactionType.INCOME
    );
    const transfers = allTransactions.filter(
      (transaction: Transaction) =>
        transaction.type === TransactionType.TRANSFER
    );

    return { expenses, income, transfers, latest };
  }, [accounts]);

  const balances = useMemo(() => {
    const total = accounts.reduce((sum: number, account: Account) => {
      return +sum + +account.balance;
    }, 0);

    const expenses = transactions.expenses.reduce(
      (sum: number, transaction: Transaction) => {
        return +sum + +transaction.amount;
      },
      0
    );

    const income = transactions.income.reduce(
      (sum: number, transaction: Transaction) => {
        return +sum + +transaction.amount;
      },
      0
    );
    const transfers = transactions.transfers.reduce(
      (sum: number, transaction: Transaction) => {
        return +sum + +transaction.amount;
      },
      0
    );

    return { total, expenses, income, transfers };
  }, [accounts, transactions]);

  return (
    <>
      <div className="py-6 space-y-6 h-full overflow-y-auto">
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row items-center justify-between">
          <div className="flex-shrink-0">
            <Greeting />
            <p>Let's see how much you have spent today</p>
          </div>
          {setupTasks.length > 0 && (
            <div className="space-y-2 flex flex-col items-end w-full">
              <p className="text-xs">
                Here's a couple of things to get you started
              </p>
              <div className="flex items-center justify-end space-x-4 overflow-auto w-full">
                {setupTasks.map((tasks, index) => {
                  return (
                    <React.Fragment key={index}>
                      <div
                        className="p-2 px-4 w-44 rounded cursor-pointer flex items-center space-x-2 bg-primary text-white"
                        onClick={() => showModal(tasks.modal)}
                      >
                        <Icon width={40} icon={tasks.icon} />
                        <p className="text-sm">{tasks.text}</p>
                      </div>
                      {index < setupTasks.length - 1 && (
                        <Icon
                          className="flex-shrink-0"
                          icon="solar:arrow-right-line-duotone"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-secondary p-4 rounded w-full text-white space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">Total Balance</p>
              <Icon
                width={30}
                className="text-primary"
                icon="solar:wallet-bold-duotone"
              />
            </div>
            <h2>{helperUtil.currencyConverter(balances.total)}</h2>
            <div className="flex items-center space-x-3 w-full">
              {accounts.map((account: Account) => {
                return (
                  <div
                    key={account.id}
                    title={account.name}
                    className="flex items-center space-x-1 relative group cursor-default"
                  >
                    <div
                      className="rounded-full w-1.5 h-1.5"
                      style={{ backgroundColor: account.colorCode || "#000" }}
                    ></div>
                    <p className="text-[10px] font-header font-medium transition-all opacity-0 hidden group-hover:block group-hover:opacity-100">
                      {account.name}
                    </p>
                    <p className="text-[10px]">
                      {helperUtil.currencyConverter(account.balance)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-secondary p-4 rounded w-full text-white space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">Total Income</p>
              <Icon
                width={30}
                className="text-primary"
                icon="solar:money-bag-bold-duotone"
              />
            </div>
            <h2>{helperUtil.currencyConverter(balances.income)}</h2>
          </div>
          <div className="bg-secondary p-4 rounded w-full text-white space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">Total Expenses</p>
              <Icon
                width={30}
                className="text-primary"
                icon="solar:banknote-2-bold-duotone"
              />
            </div>
            <h2>{helperUtil.currencyConverter(balances.expenses)}</h2>
          </div>
          <div className="bg-secondary p-6 rounded w-full text-white space-y-6">
            {currentBudget ? (
              <>
                <h3>{currentBudget.title} Budget</h3>
                <div className="space-y-4 max-h-[680px] overflow-auto">
                  {currentBudget.expenses.map((budgetItem: IBudgetItem) => {
                    const categoryTransactions = transactions.expenses.filter(
                      (transaction: Transaction) =>
                        transaction.category == budgetItem.category
                    );
                    const transactionCosts = categoryTransactions.reduce(
                      (total, transaction) => +total + +transaction.amount,
                      0
                    );
                    const percentageSpent = Math.floor(
                      (transactionCosts / budgetItem.amount) * 100
                    );
                    const category = getCategory(budgetItem.category);

                    return (
                      <React.Fragment key={budgetItem.category}>
                        <div
                          title={`${percentageSpent}% of ${category?.name} allocation spent`}
                          className="flex flex-col w-full space-y-2"
                        >
                          <p>{category?.name}</p>
                          <div className="flex space-x-2">
                            <div className="relative bg-background flex items-center pr-2 h-8 w-full overflow-hidden">
                              <div
                                className="absolute h-full flex items-center justify-end pr-1"
                                style={{
                                  width: `${
                                    percentageSpent >= 100
                                      ? 100
                                      : percentageSpent
                                  }%`,
                                  backgroundColor:
                                    percentageSpent >= 100
                                      ? "#A50000"
                                      : "#29A9CE",
                                }}
                              >
                                {percentageSpent >= 70 && (
                                  <p className="text-xs pl-2 mr-auto">
                                    {helperUtil.currencyConverter(
                                      budgetItem.amount
                                    )}
                                  </p>
                                )}
                                <p className="text-xs">
                                  {helperUtil.currencyConverter(
                                    transactionCosts
                                  )}{" "}
                                  <span className="text-[10px]">
                                    [{percentageSpent}%]
                                  </span>
                                </p>
                              </div>
                              {percentageSpent < 70 && (
                                <p className=" ml-auto text-xs">
                                  {helperUtil.currencyConverter(
                                    budgetItem.amount
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid place-items-center h-full">
                No active budget
              </div>
            )}
          </div>
          <div className="bg-secondary p-6 rounded w-full text-white space-y-4 lg:col-span-2">
            <p className="text-lg font-semibold">Latest Transactions</p>
            <div className="w-full overflow-auto">
              <Table
                data={transactions.latest}
                emptyMessage={"No transactions"}
                exclude={["id", "date", "description", "timestamp"]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

useLayout(DashboardLayout, DashboardPage, "Dashboard");

export default DashboardPage;
