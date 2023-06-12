import { useSelector } from "react-redux";
import { Category } from "@/models/category";
import { RootState } from "@/store/rootReducer";
import { selectCategories } from "@/store/slices/categoriesSlice";
import { selectAccounts } from "@/store/slices/accountsSlice";
import { Account } from "@/models/account";

const useMeta = () => {
  const accounts = useSelector((state: RootState) => selectAccounts(state));
  const categories = useSelector((state: RootState) => selectCategories(state));

  const getCategory = (categoryID: string) => {
    return categories.find((category: Category) => category.id == categoryID)
  }

  const getAccount = (accountID: string) => {
    return accounts.find((account: Account) => account.id == accountID)
  }

  return { getCategory, getAccount };
}

export default useMeta;