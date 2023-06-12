import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";

import useLayout from "@/hooks/useLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "./_app";
import { selectAccounts } from "@/store/slices/accountsSlice";
import { Account } from "@/models/account";
import ResizedImage from "@/components/ResizedImage";
import helperUtil from "@/utils/helper.util";
import Button from "@/components/Button";
import { useModal } from "@/components/ModalManager";
import AccountModal from "@/components/modals/AccountModal";
import EmptyState from "@/components/EmptyState";

const AccountsPage: NextPageWithLayout = () => {
  const accounts = useSelector((state: RootState) => selectAccounts(state));

  const { showModal } = useModal();

  return (
    <>
      <div className="py-6 space-y-6 h-full">
        {accounts.length > 0 ? (
          <>
            <Button
              className="w-max ml-auto"
              onClick={() => showModal(<AccountModal />)}
            >
              Add Account
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {accounts.map((account: Account) => {
                return (
                  <div key={account.id} className="space-y-3">
                    <div className="bg-secondary p-4">
                      <ResizedImage
                        className="w-full h-32"
                        src={account.bank.logo}
                        alt={account.name}
                      />
                    </div>
                    <div className="space-y-1">
                      <p>{account.name}</p>
                      <p className="text-lg font-header font-medium">
                        {helperUtil.currencyConverter(account.balance)}
                      </p>
                      <p className="text-sm">
                        {account.transactions.length} transaction
                        {account.transactions.length == 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <EmptyState
            onClick={() => showModal(<AccountModal />)}
            message="Get started by adding your accounts"
            actionText="Add Account"
          />
        )}
      </div>
    </>
  );
};

useLayout(DashboardLayout, AccountsPage, "Accounts");

export default AccountsPage;
