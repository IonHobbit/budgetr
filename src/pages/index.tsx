import { Icon } from "@iconify/react";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { NextPageWithLayout } from "./_app";
import { RootState } from "@/store/rootReducer";
import { selectUser } from "@/store/slices/userSlice";

import useMeta from "@/hooks/useMeta";
import useLayout from "@/hooks/useLayout";

import DashboardLayout from "@/layouts/DashboardLayout";
import { selectAccountsState } from "@/store/slices/accountsSlice";
import { selectBudgetsState } from "@/store/slices/budgetsSlice";
import helperUtil from "@/utils/helper.util";

import Table from "@/components/Table";

import { Account } from "@/models/account";
import { Budget, IBudgetItem } from "@/models/budget";
import { Transaction, TransactionType } from "@/models/transaction";
import CategoryModal from "@/components/modals/CategoryModal";
import { useModal } from "@/components/ModalManager";
import routes from "@/constants/routes";
import { selectCategoriesState } from "@/store/slices/categoriesSlice";
import AccountModal from "@/components/modals/AccountModal";
import BudgetModal from "@/components/modals/BudgetModal";
import BalanceCard from "@/components/cards/BalanceCard";
import { Loader } from "@/components/Loader";
import TransactionModal from "@/components/modals/TransactionModal";

const DashboardPage: NextPageWithLayout = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const { data: budgets, loading: budgetsLoader } = useSelector(
    (state: RootState) => selectBudgetsState(state)
  );
  const { data: accounts, loading: accountsLoader } = useSelector(
    (state: RootState) => selectAccountsState(state)
  );
  const { data: categories, loading: categoriesLoader } = useSelector(
    (state: RootState) => selectCategoriesState(state)
  );

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

    if (budgetsLoader || accountsLoader || categoriesLoader) {
      return [];
    }

    return tasks.filter((task) => {
      return !completedTasks[task.name];
    });
  }, [
    categories,
    accounts,
    budgets,
    budgetsLoader,
    categoriesLoader,
    accountsLoader,
  ]);

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
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center justify-between">
          <div className="flex-shrink-0">
            <Greeting />
            <p>Let's see how much you have spent today</p>
          </div>
          {setupTasks.length > 0 && (
            <div className="space-y-2 flex flex-col items-end w-full">
              <p className="text-xs">
                Here's a couple of things to get you started
              </p>
              <div className="flex items-center lg:justify-end space-x-4 overflow-auto w-full">
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
          <BalanceCard
            title="Total Balance"
            icon="solar:wallet-bold-duotone"
            balance={balances.total}
            type="balance"
          />
          <BalanceCard
            title="Total Income"
            icon="solar:money-bag-bold-duotone"
            balance={balances.income}
            type="income"
          />
          <BalanceCard
            title="Total Expenses"
            icon="solar:banknote-2-bold-duotone"
            balance={balances.expenses}
            type="expenses"
          />
          <div className="bg-secondary p-6 rounded w-full text-white space-y-6">
            {budgetsLoader && !currentBudget ? (
              <div className="grid place-items-center h-full">
                <Loader size="large" />
              </div>
            ) : (
              <>
                {currentBudget ? (
                  <>
                    <div
                      className="flex items-center space-x-2 group cursor-pointer"
                      onClick={() =>
                        showModal(<BudgetModal budget={currentBudget} />)
                      }
                    >
                      <h3 className="transition-all">
                        {currentBudget.title} Budget
                      </h3>
                      <Icon
                        className="invisible translate-x-0 group-hover:visible animate-bounce group-hover:translate-x-12 transition-all "
                        icon="solar:circle-top-up-linear"
                      />
                    </div>
                    <div className="space-y-4 max-h-[680px] overflow-auto">
                      {currentBudget.expenses.map((budgetItem: IBudgetItem) => {
                        const categoryTransactions =
                          transactions.expenses.filter(
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
                                    <p className="text-xs flex items-center">
                                      {helperUtil.currencyConverter(
                                        transactionCosts
                                      )}{" "}
                                      <span className="text-[10px] ml-0.5">
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
              </>
            )}
          </div>
          <div className="bg-secondary p-6 rounded w-full text-white space-y-4 lg:col-span-2">
            <p className="text-lg font-semibold">Latest Transactions</p>
            <div className="w-full overflow-auto">
              <Table
                data={transactions.latest}
                emptyMessage={"No transactions"}
                exclude={["id", "date", "description", "timestamp"]}
                onClick={(transaction: Transaction) =>
                  showModal(<TransactionModal transaction={transaction} />)
                }
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
