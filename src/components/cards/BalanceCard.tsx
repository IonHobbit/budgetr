import { Account } from "@/models/account";
import { RootState } from "@/store/rootReducer";
import { selectAccounts } from "@/store/slices/accountsSlice";
import helperUtil from "@/utils/helper.util";
import { Icon } from "@iconify/react";
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

  return (
    <div className="bg-secondary p-4 rounded flex flex-col w-full text-white space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm">{title}</p>
        <Icon width={30} className="text-primary" icon={icon} />
      </div>
      <div className="flex flex-col justify-center h-full space-y-2">
        <h2>{helperUtil.currencyConverter(balance)}</h2>
        <div className="flex items-center space-x-3 w-full overflow-x-auto">
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
                <p className="text-[10px] font-header font-medium transition-all opacity-0 whitespace-nowrap hidden group-hover:block group-hover:opacity-100">
                  {account.name} | {account.bank.name}
                </p>
                <p className="text-[10px]">
                  {helperUtil.currencyConverter(
                    type == "balance" ? account.balance : account.totals[type]
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
