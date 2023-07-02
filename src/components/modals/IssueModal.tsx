import { useFormik } from "formik";
import Input from "../Input";
import Modal from "../Modal";
import { issueValidationSchema } from "@/utils/validation-schema.util";
import { useSelector } from "react-redux";
import { RootState } from "@/store/rootReducer";
import { selectUser } from "@/store/slices/userSlice";
import Button from "../Button";
import { useEffect, useState } from "react";
import notification from "@/utils/notification";
import { useModal } from "../ModalManager";
import Select from "../Select";
import helperUtil from "@/utils/helper.util";
import { ISSUE_LABELS } from "@/constants/constants";
import { createIssue } from "@/utils/octokit.util";
import { CreateIssueRequest } from "@/interfaces/requests.interface";
import { GENERIC_ERROR } from "@/constants/errorMessages";
import { Icon } from "@iconify/react";

const IssueModal: React.FC = () => {
  const user = useSelector((state: RootState) => selectUser(state));

  const [loading, setLoading] = useState(false);

  const { hideModal } = useModal();

  const submitForm = async (payload: any) => {
    if (loading) return;

    const _payload: CreateIssueRequest = {
      title: payload.title,
      body: `${payload.body} - from: ${user?.firstName} ${user?.lastName} - ${user?.email}`,
      labels: [payload.label],
    };

    setLoading(true);

    try {
      await createIssue(_payload);
      notification.success("Thank you for your feedback");
      hideModal();
    } catch (error) {
      notification.error(GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const issueForm = useFormik({
    initialValues: {
      title: "",
      body: "",
      label: ISSUE_LABELS[0],
    },
    validationSchema: issueValidationSchema,
    onSubmit: async ({ title, body, label }) =>
      submitForm({ title, body, label }),
  });

  useEffect(() => {}, []);

  return (
    <Modal size="x-small" spacing={true}>
      <div className="flex items-center space-x-2">
        <Icon icon="solar:chat-line-bold-duotone" width={24} />
        <h5>Give Feedback</h5>
      </div>

      <form
        onSubmit={issueForm.handleSubmit}
        className="flex flex-col space-y-6"
      >
        <Input
          title="Title"
          name="title"
          variation="secondary"
          form={issueForm}
          placeholder="Feedback title"
        />
        <Input
          title="Description"
          name="body"
          type="textarea"
          variation="secondary"
          form={issueForm}
          placeholder="Feedback description"
        />
        <Select
          title="Type"
          name="label"
          required={true}
          variation="secondary"
          options={helperUtil.transformToSelectOptions(ISSUE_LABELS)}
          form={issueForm}
        />
        <Button loading={loading}>Send</Button>
      </form>
    </Modal>
  );
};

export default IssueModal;
