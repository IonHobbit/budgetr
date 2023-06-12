import { useFormik } from "formik";
import Input from "../Input";
import Modal from "../Modal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { accountValidationSchema } from "@/utils/validation-schema.util";
import Button from "../Button";
import { useEffect, useMemo, useState } from "react";
import notification from "@/utils/notification";
import { useModal } from "../ModalManager";
import { CreateAccountRequest } from "@/interfaces/requests.interface";
import { DUPLICATE_ENTITY } from "@/constants/errorMessages";
import useDispatcher from "@/hooks/useDispatcher";
import {
  fetchAccounts,
  selectAccounts,
  selectBanks,
  setBanks,
} from "@/store/slices/accountsSlice";
import { Account, IBank } from "@/models/account";
import { createAccount, fetchBanks } from "@/pages/api/account.api";
import Select from "../Select";
import helperUtil from "@/utils/helper.util";
import Image from "next/image";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { selectUser } from "@/store/slices/userSlice";

const AccountModal: React.FC = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const banks = useSelector((state: RootState) => selectBanks(state));
  const accounts = useSelector((state: RootState) => selectAccounts(state));

  const [loading, setLoading] = useState(false);
  const [colorCode, setColorCode] = useState("#29A9CE");

  const dispatcher = useDispatcher();
  const { hideModal } = useModal();

  const submitForm = async (payload: any) => {
    if (loading) return;
    if (accounts.find((account: Account) => account.name == payload.name))
      return notification.warning(DUPLICATE_ENTITY);

    const _payload: CreateAccountRequest = {
      ...payload,
      colorCode: colorCode.toLocaleUpperCase(),
      bank: selectedBank,
    };

    setLoading(true);

    try {
      await createAccount(user!.id, _payload);
      notification.success("Account created");
      dispatcher(fetchAccounts(user!.id));
      setLoading(false);
      hideModal();
    } catch (error) {
      setLoading(false);
    }
  };

  const accountForm = useFormik({
    initialValues: {
      name: "",
      bank: "",
      balance: 0,
    },
    validationSchema: accountValidationSchema,
    onSubmit: async ({ name, bank, balance }) =>
      submitForm({ name, bank, balance }),
  });

  const populateBanks = async () => {
    const response = await fetchBanks();
    accountForm.setFieldValue("bank", response[0].slug);
    dispatcher(setBanks(response));
  };

  const selectedBank = useMemo(() => {
    const _bank = banks.find(
      (bank: IBank) => bank.slug == accountForm.values.bank
    );
    return _bank;
  }, [banks, accountForm.values.bank]);

  useEffect(() => {
    populateBanks();
  }, []);

  return (
    <Modal size="x-small" spacing={true}>
      <h5>Add Bank Account</h5>

      <form
        onSubmit={accountForm.handleSubmit}
        className="flex flex-col space-y-6"
      >
        {selectedBank && (
          <div className="w-auto h-20 relative">
            <Image
              sizes="100%"
              fill={true}
              src={selectedBank.logo}
              className="object-contain"
              alt={`${selectedBank.name}'s logo`}
              loading="lazy"
            />
          </div>
        )}
        <Input
          title="Account Name/Label"
          name="name"
          variation="secondary"
          form={accountForm}
          placeholder="eg Savings Account"
        />
        <Select
          title="Bank"
          name="bank"
          required={true}
          variation="secondary"
          options={helperUtil.transformToSelectOptions(
            banks.map((bank: IBank) => ({
              id: bank.slug,
              name: bank.name,
            }))
          )}
          form={accountForm}
        />
        <Input
          title="Opening Balance"
          name="balance"
          type="number"
          variation="secondary"
          form={accountForm}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <p className="col-span-2 text-sm">Account Color</p>
          <div className="space-y-1.5">
            <HexColorPicker
              className="!w-full !h-40"
              color={colorCode}
              onChange={setColorCode}
            />
          </div>
          <div className="h-full w-full flex flex-col justify-between space-y-3">
            <div
              className="w-full h-[80%] rounded-lg"
              style={{ backgroundColor: colorCode }}
            />
            <HexColorInput
              className="w-full rounded-md px-2 py-1 border border-primary focus:outline-none uppercase"
              color={colorCode}
              onChange={setColorCode}
            />
          </div>
        </div>
        <Button loading={loading}>Create Account</Button>
      </form>
    </Modal>
  );
};

export default AccountModal;
