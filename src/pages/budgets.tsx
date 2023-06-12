import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";

import useLayout from "@/hooks/useLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "./_app";
import Table from "@/components/Table";
import { selectBudgets } from "@/store/slices/budgetsSlice";
import { useModal } from "@/components/ModalManager";
import BudgetModal from "@/components/modals/BudgetModal";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";

const BudgetsPage: NextPageWithLayout = () => {
  const budgets = useSelector((state: RootState) => selectBudgets(state));

  const { showModal } = useModal();

  return (
    <>
      <div className="py-6 space-y-6 h-full">
        {budgets.length > 0 ? (
          <>
            <Button
              className="w-max ml-auto"
              onClick={() => showModal(<BudgetModal />)}
            >
              Create Budget
            </Button>
            <div className="grid overflow-x-auto">
              <Table
                className="overflow-hidden"
                data={budgets}
                emptyMessage="Create your first budget"
                exclude={[
                  "id",
                  "type",
                  "date",
                  "timestamp",
                  "expenses",
                  "income",
                ]}
                onClick={(data) => showModal(<BudgetModal budget={data} />)}
              />
            </div>
          </>
        ) : (
          <EmptyState
            onClick={() => showModal(<BudgetModal />)}
            message="Get started by creating your first budget"
            actionText="Create Budget"
          />
        )}
      </div>
    </>
  );
};

useLayout(DashboardLayout, BudgetsPage, "Budgets");

export default BudgetsPage;
