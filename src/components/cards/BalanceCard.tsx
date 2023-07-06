import { Account } from "@/models/account";
import { RootState } from "@/store/rootReducer";
import { selectAccounts } from "@/store/slices/accountsSlice";
import helperUtil from "@/utils/helper.util";
import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

type BalanceCardProps = {
  icon: string;
  title: string;
  balance: number;
  type: "balance" | "expenses" | "income";
};

const BalanceCard: React.FC<BalanceCardProps> = ({
  icon,
  title,
  balance,
  type,
}) => {
  const accounts = useSelector((state: RootState) => selectAccounts(state));

  const [selectedAccounts, setSelectedAccounts] = useState<Array<Account>>([]);

  const findAccountIndex = (account: Account) => {
    return selectedAccounts.findIndex(
      (_account: Account) => _account.id == account.id
    );
  };

  const selectAccount = (account: Account) => {
    const accountIndex = findAccountIndex(account);

    if (accountIndex >= 0) {
      const updatedAccounts = [...selectedAccounts];
      updatedAccounts.splice(accountIndex, 1);

      setSelectedAccounts(updatedAccounts);
    } else {
      setSelectedAccounts([...selectedAccounts, account]);
    }
  };

  const displayedBalance = useMemo(() => {
    const removedAccountsBalance = selectedAccounts.reduce((total, account) => {
      const balance =
        type == "balance" ? account.balance : account.totals[type];
      return +total + +balance;
    }, 0);
    return balance - removedAccountsBalance;
  }, [balance, selectedAccounts]);

  return (
    <div className="bg-secondary p-4 rounded flex flex-col w-full text-white space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm">{title}</p>
        <Icon width={30} className="text-primary" icon={icon} />
      </div>
      <div className="flex flex-col justify-center h-full space-y-2">
        <h2>{helperUtil.currencyConverter(displayedBalance)}</h2>
        <div className="flex items-center space-x-3 w-full overflow-x-auto">
          {accounts.map((account: Account) => {
            return (
              <div
                key={account.id}
                title={account.name}
                onClick={() => selectAccount(account)}
                className={`flex items-center space-x-1 relative group cursor-pointer overflow-visible ${
                  findAccountIndex(account) >= 0 && "line-through"
                }`}
              >
                <div
                  className="rounded-full w-1.5 h-1.5"
                  style={{ backgroundColor: account.colorCode || "#000" }}
                ></div>
                <p className="text-[10px] font-header font-medium transition-all opacity-0 whitespace-nowrap hidden group-hover:block group-hover:opacity-100">
                  {account.name} | {account.bank.name}
                </p>
                <p className="text-[10px]">
                  {helperUtil.currencyConverter(
                    type == "balance"
                      ? account.balance
                      : account.totals?.[type] || 0
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
