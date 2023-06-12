import { setIn, useFormik } from "formik";
import Input from "../Input";
import Modal from "../Modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { budgetValidationSchema } from "@/utils/validation-schema.util";
import Button from "../Button";
import { useEffect, useMemo, useState } from "react";
import notification from "@/utils/notification";
import { useModal } from "../ModalManager";
import Select from "../Select";
import helperUtil from "@/utils/helper.util";
import { Category, CategoryType } from "@/models/category";
import {
  fetchCategories,
  selectCategories,
} from "@/store/slices/categoriesSlice";
import { BUDGET_CATEGORIES } from "@/constants/constants";
import {
  CreateBudgetRequest,
  EditBudgetRequest,
} from "@/interfaces/requests.interface";
import { DUPLICATE_ENTITY } from "@/constants/errorMessages";
import useDispatcher from "@/hooks/useDispatcher";
import { Budget, BudgetCategory, IBudgetItem } from "@/models/budget";
import { fetchBudgets, selectBudgets } from "@/store/slices/budgetsSlice";
import { createBudget, editBudget } from "@/pages/api/budget.api";
import { Icon } from "@iconify/react";
import { selectUser } from "@/store/slices/userSlice";

type BudgetModalProps = {
  budget?: Budget;
};

const BudgetModal: React.FC<BudgetModalProps> = ({ budget }) => {
  const user = useSelector((state: RootState) => selectUser(state));
  const budgets = useSelector((state: RootState) => selectBudgets(state));
  const categories = useSelector((state: RootState) => selectCategories(state));

  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState<IBudgetItem[]>([]);
  const [expenses, setExpenses] = useState<IBudgetItem[]>([]);
  const [selectedType, setSelectedType] = useState(BUDGET_CATEGORIES[0]);

  const dispatcher = useDispatcher();
  const { hideModal } = useModal();

  const incomeCategories = useMemo(() => {
    const filtered = categories.filter(
      (category: Category) => category.type == CategoryType.INCOME
    );
    const unselected = filtered.filter(
      (category: Category) =>
        !income
          .map((_income: IBudgetItem) => _income.category)
          .includes(category.id)
    );

    return { unselected, filtered };
  }, [categories, income]);

  const expenseCategories = useMemo(() => {
    const filtered = categories.filter(
      (category: Category) => category.type == CategoryType.EXPENSE
    );
    const unselected = filtered.filter(
      (category: Category) =>
        !expenses
          .map((expense: IBudgetItem) => expense.category)
          .includes(category.id)
    );

    return { unselected, filtered };
  }, [categories, expenses]);

  const updateIncome = (_income: IBudgetItem, index?: number) => {
    const clonedIncome = [...income];
    if (typeof index == "number") {
      clonedIncome[index] = _income;
    } else {
      clonedIncome.push(_income);
    }
    setIncome(clonedIncome);
  };

  const removeIncome = (index: number) => {
    const clonseIncome = [...income];
    clonseIncome.splice(index, 1);
    setIncome(clonseIncome);
  };

  const updateExpenses = (expense: IBudgetItem, index?: number) => {
    const clonedExpenses = [...expenses];
    if (typeof index == "number") {
      clonedExpenses[index] = expense;
    } else {
      clonedExpenses.push(expense);
    }
    setExpenses(clonedExpenses);
  };

  const removeExpense = (index: number) => {
    const clonedExpenses = [...expenses];
    clonedExpenses.splice(index, 1);
    setExpenses(clonedExpenses);
  };

  const addItem = () => {
    if (selectedType == BudgetCategory.EXPENSES) {
      if (expenseCategories.unselected.length > 0) {
        const expense = {
          amount: 100,
          category: expenseCategories.unselected[0].id,
        } as IBudgetItem;
        updateExpenses(expense);
      }
    } else {
      if (incomeCategories.unselected.length > 0) {
        const income = {
          amount: 100,
          category: incomeCategories.unselected[0].id,
        } as IBudgetItem;
        updateIncome(income);
      }
    }
  };

  const submitForm = async (payload: any) => {
    if (loading) return;
    if (
      !budget &&
      budgets.find((budget: Budget) => budget.title == payload.title)
    )
      return notification.warning(DUPLICATE_ENTITY);
    if (expenses.length < 1)
      return notification.error("You're not spending any money at all?");

    const totalExpenditure = expenses.reduce(
      (total, expense) => +total + +expense.amount,
      0
    );
    const projectedIncome = income.reduce(
      (total, _income) => +total + +_income.amount,
      0
    );

    const _payload = {
      ...payload,
      expenses: expenses,
      income: income,
      totalExpenditure,
      projectedIncome,
    };

    setLoading(true);

    try {
      if (budget) {
        const updatePayload: EditBudgetRequest = { ..._payload, id: budget.id };
        await editBudget(user!.id, updatePayload);
        notification.success("Budget updated");
      } else {
        await createBudget(user!.id, _payload as CreateBudgetRequest);
        notification.success("Budget created");
      }
      dispatcher(fetchBudgets(user!.id));
      setLoading(false);
      hideModal();
    } catch (error) {
      setLoading(false);
    }
  };

  const budgetForm = useFormik({
    initialValues: {
      title: "",
      startDate: helperUtil.dateFormatter(new Date()),
      endDate: helperUtil.dateFormatter(
        new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
      ),
    },
    validationSchema: budgetValidationSchema,
    onSubmit: async ({ title, startDate, endDate }) =>
      submitForm({ title, startDate, endDate }),
  });

  useEffect(() => {
    dispatcher(fetchBudgets(user!.id));
    dispatcher(fetchCategories());
    if (budget) {
      budgetForm.setFieldValue("title", budget.title);
      budgetForm.setFieldValue("startDate", budget.startDate);
      budgetForm.setFieldValue("endDate", budget.endDate);
      setIncome(budget.income);
      setExpenses(budget.expenses);
    }
  }, [user]);

  return (
    <Modal size="small" spacing={true}>
      <h5>{budget ? "Edit" : "Create New"} Budget</h5>

      <form
        onSubmit={budgetForm.handleSubmit}
        className="flex flex-col space-y-6"
      >
        <Input
          title="Budget Title"
          name="title"
          variation="secondary"
          form={budgetForm}
          placeholder={`eg. ${helperUtil.monthFormatter(new Date())}`}
        />
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-x-4 lg:space-y-0">
          <Input
            title="Start Date"
            name="startDate"
            type="date"
            min={helperUtil.dateFormatter(new Date())}
            variation="secondary"
            form={budgetForm}
          />
          <Input
            title="End Date"
            name="endDate"
            type="date"
            variation="secondary"
            form={budgetForm}
          />
        </div>
        <div className="flex items-center space-x-4">
          {BUDGET_CATEGORIES.map((type: BudgetCategory) => {
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
          <div
            onClick={addItem}
            className="grid place-items-center cursor-pointer bg-primary text-white rounded p-3"
          >
            <Icon icon="solar:add-square-line-duotone" />
          </div>
        </div>
        <div className="space-y-4">
          {
            {
              expenses: (
                <>
                  {expenses.map((expense: IBudgetItem, index) => {
                    return (
                      <div
                        key={expense.category}
                        className="grid grid-cols-6 place-items-end gap-x-4"
                      >
                        <Select
                          className="col-span-3"
                          options={helperUtil.transformToSelectOptions([
                            categories.find(
                              (category: Category) =>
                                expense.category == category.id
                            ),
                            ...expenseCategories.unselected,
                          ])}
                          variation="secondary"
                          title="Category"
                          value={expense.category}
                          onChange={(value) => {
                            updateExpenses(
                              { ...expense, category: value },
                              index
                            );
                          }}
                        />
                        <Input
                          className="col-span-2"
                          title="Projected Amount"
                          type="number"
                          variation="secondary"
                          value={expense.amount}
                          onChange={(value) =>
                            updateExpenses(
                              {
                                ...expense,
                                amount: Number(value),
                              },
                              index
                            )
                          }
                        />
                        <div
                          onClick={() => removeExpense(index)}
                          className="grid place-items-center cursor-pointer bg-error text-white rounded p-3"
                        >
                          <Icon icon="solar:minus-square-line-duotone" />
                        </div>
                      </div>
                    );
                  })}
                </>
              ),
              income: (
                <>
                  {income.map((income: IBudgetItem, index) => {
                    return (
                      <div
                        key={income.category}
                        className="grid grid-cols-6 place-items-end gap-x-4"
                      >
                        <Select
                          className="col-span-3"
                          options={helperUtil.transformToSelectOptions([
                            categories.find(
                              (category: Category) =>
                                income.category == category.id
                            ),
                            ...incomeCategories.unselected,
                          ])}
                          variation="secondary"
                          title="Category"
                          value={income.category}
                          onChange={(value) => {
                            updateIncome({ ...income, category: value }, index);
                          }}
                        />
                        <Input
                          className="col-span-2"
                          title="Projected Amount"
                          type="number"
                          variation="secondary"
                          value={income.amount}
                          onChange={(value) =>
                            updateIncome(
                              {
                                ...income,
                                amount: Number(value),
                              },
                              index
                            )
                          }
                        />
                        <div
                          onClick={() => removeIncome(index)}
                          className="grid place-items-center cursor-pointer bg-error text-white rounded p-3"
                        >
                          <Icon icon="solar:minus-square-line-duotone" />
                        </div>
                      </div>
                    );
                  })}
                </>
              ),
            }[selectedType]
          }
        </div>
        <Button loading={loading}>{budget ? "Update" : "Save"} Budget</Button>
      </form>
    </Modal>
  );
};

export default BudgetModal;
