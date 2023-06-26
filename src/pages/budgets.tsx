import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { NextPageWithLayout } from "./_app";

import useLayout from "@/hooks/useLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { selectBudgets } from "@/store/slices/budgetsSlice";

import Table from "@/components/Table";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import { useModal } from "@/components/ModalManager";
import BudgetModal from "@/components/modals/BudgetModal";
import CategoryModal from "@/components/modals/CategoryModal";
import { selectCategories } from "@/store/slices/categoriesSlice";
import { Icon } from "@iconify/react";

const BudgetsPage: NextPageWithLayout = () => {
  const budgets = useSelector((state: RootState) => selectBudgets(state));
  const categories = useSelector((state: RootState) => selectCategories(state));

  const { showModal } = useModal();

  return (
    <>
      <div className="py-6 h-full">
        <div className="grid lg:grid-cols-8 gap-6">
          <div className="lg:col-span-6 space-y-6 h-full">
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
          <div className="hidden lg:block lg:col-span-2 space-y-6 h-full">
            {categories.length > 0 ? (
              <>
                <Button
                  className="w-max ml-auto"
                  onClick={() => showModal(<CategoryModal />)}
                >
                  Create Category
                </Button>
                <div className="grid overflow-x-auto">
                  <Table
                    className="overflow-hidden"
                    data={categories}
                    emptyMessage="Create your first category"
                    exclude={["id", "timestamp"]}
                    onClick={(data) =>
                      showModal(<CategoryModal category={data} />)
                    }
                  />
                </div>
              </>
            ) : (
              <EmptyState
                onClick={() => showModal(<CategoryModal />)}
                message="Get started by creating your first category"
                actionText="Create Category"
              />
            )}
          </div>
          <div className="flex flex-col space-y-3 items-center lg:hidden">
            <Icon
              width={80}
              className="text-primary"
              icon="solar:folder-favourite-bookmark-bold-duotone"
            />
            <p className="text-center">
              View and Manage your categories from the desktop dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

useLayout(DashboardLayout, BudgetsPage, "Budgets & Categories");

export default BudgetsPage;
