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
import {
  CreateCategoryRequest,
  EditCategoryRequest,
} from "@/interfaces/requests.interface";
import {
  createCategory,
  deleteCategory,
  editCategory,
} from "@/pages/api/category.api";
import { DUPLICATE_ENTITY } from "@/constants/errorMessages";
import useDispatcher from "@/hooks/useDispatcher";
import { selectUser } from "@/store/slices/userSlice";
import { Icon } from "@iconify/react";

type CategoryModalProps = {
  category?: Category;
  type?: CategoryType;
};

const CategoryModal: React.FC<CategoryModalProps> = ({ category, type }) => {
  const user = useSelector((state: RootState) => selectUser(state));
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
    if (
      !category &&
      categories.find((category: Category) => category.name == payload.name)
    )
      return notification.warning(DUPLICATE_ENTITY);

    setLoading(true);
    try {
      if (category) {
        const updatePayload: EditCategoryRequest = {
          ...payload,
          id: category.id,
        };
        await editCategory(user!.id, updatePayload);
        notification.success("Category edited");
      } else {
        await createCategory(user!.id, payload);
        notification.success("Category created");
      }
      dispatcher(fetchCategories(user!.id));
      hideModal();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    setLoading(true);

    try {
      if (category) {
        await deleteCategory(user!.id, category);
        notification.success("Category deleted");
      }
      dispatcher(fetchCategories(user!.id));
      hideModal();
    } catch (error) {
    } finally {
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
    dispatcher(fetchCategories(user!.id));
    categoryForm.setFieldValue("category", categories[0]?.id);

    if (category) {
      categoryForm.setFieldValue("name", category.name);
      categoryForm.setFieldValue("type", category.type);
    }

    if (type) {
      categoryForm.setFieldValue("type", type);
    }
  }, [user]);

  return (
    <Modal size="x-small" spacing={true}>
      <div className="flex items-center space-x-2">
        <Icon width={24} icon="solar:folder-favourite-bookmark-bold-duotone" />
        <h5>{category ? "Edit" : "Add New"} Category</h5>
      </div>

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
        <Button loading={loading}>
          {category ? "Update" : "Save"} Category
        </Button>
        {category && (
          <Button onClick={deleteHandler} loading={loading} variation="errored">
            Delete Category
          </Button>
        )}
      </form>
    </Modal>
  );
};

export default CategoryModal;
