import { useFormik } from "formik";
import Input from "../Input";
import Modal from "../Modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { categoryValidationSchema } from "@/utils/validation-schema.util";
import Button from "../Button";
import { useEffect, useState } from "react";
import notification from "@/utils/notification";
import { useModal } from "../ModalManager";
import Select from "../Select";
import helperUtil from "@/utils/helper.util";
import { Category, CategoryType } from "@/models/category";
import {
  fetchCategories,
  selectCategories,
} from "@/store/slices/categoriesSlice";
import { CATEGORY_TYPES } from "@/constants/constants";
import { CreateCategoryRequest } from "@/interfaces/requests.interface";
import { createCategory } from "@/pages/api/category.api";
import { DUPLICATE_ENTITY } from "@/constants/errorMessages";
import useDispatcher from "@/hooks/useDispatcher";

const CategoryModal: React.FC = () => {
  const categories = useSelector((state: RootState) => selectCategories(state));

  const [loading, setLoading] = useState(false);

  const dispatcher = useDispatcher();
  const { hideModal } = useModal();

  const categoryTypes = helperUtil.transformToSelectOptions(CATEGORY_TYPES, [
    "Expense",
    "Income",
  ]);

  const submitForm = async (payload: CreateCategoryRequest) => {
    if (loading) return;
    if (categories.find((category: Category) => category.name == payload.name))
      return notification.warning(DUPLICATE_ENTITY);

    setLoading(true);

    try {
      await createCategory(payload);
      notification.success("Category created");
      dispatcher(fetchCategories());
      setLoading(false);
      hideModal();
    } catch (error) {
      setLoading(false);
    }
  };

  const categoryForm = useFormik({
    initialValues: {
      name: "",
      type: CategoryType.EXPENSE,
    },
    validationSchema: categoryValidationSchema,
    onSubmit: async ({ name, type }) => submitForm({ name, type }),
  });

  useEffect(() => {
    dispatcher(fetchCategories());
    categoryForm.setFieldValue("category", categories[0]?.id);
  }, []);

  return (
    <Modal size="x-small" spacing={true}>
      <h5>Add New Category</h5>

      <form
        onSubmit={categoryForm.handleSubmit}
        className="flex flex-col space-y-6"
      >
        <Input
          title="Name"
          name="name"
          variation="secondary"
          form={categoryForm}
          placeholder="eg Food & Drinks"
        />
        <Select
          title="Type"
          name="type"
          required={true}
          variation="secondary"
          options={categoryTypes}
          form={categoryForm}
        />
        <Button loading={loading}>Create Category</Button>
      </form>
    </Modal>
  );
};

export default CategoryModal;
