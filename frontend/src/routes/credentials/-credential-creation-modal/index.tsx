import { useRouter } from "@tanstack/react-router";
import { App, DatePicker, Divider, Form, Input, Modal, Select } from "antd";
import { useState } from "react";
import API from "../../../lib/api";
import IdCredentialForm from "./id-credential-form";
import DrivingPermitCredentialForm from "./driving-permit-credential-form";
import GymMembershipCredentialForm from "./gym-membership-credential-form";
import type { CreateCredentialDto } from "../../../../../backend/src/credentials/dto/create-credential.dto";

type CredentialCreationModalProps = {
  open: boolean;
  onClose: () => void;
};

const CredentialCreationModal: React.FC<CredentialCreationModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const router = useRouter();

  const credentialForms = {
    "ID Card": { form: <IdCredentialForm />, type: "ExampleIDCredential" },
    "Driving Permit": {
      form: <DrivingPermitCredentialForm />,
      type: "ExampleDrivingPermitCredential",
    },
    "Gym Membership": {
      form: <GymMembershipCredentialForm />,
      type: "ExampleGymMembershipCredential",
    },
  } as const;

  const [credentialType, setCredentialType] =
    useState<keyof typeof credentialForms>("ID Card");

  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    form.resetFields();
    setCredentialType("ID Card");
    onClose();
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      const data = await form.validateFields();

      function transformDates(input: unknown): unknown {
        // instanceof does not work on Dayjs for some reason
        if (
          input &&
          typeof input === "object" &&
          "format" in input &&
          typeof input.format === "function" &&
          "year" in input
        ) {
          return input.format("YYYY-MM-DDTHH:mm:ssZ");
        } else if (!input || typeof input !== "object") {
          return input;
        }

        if (Array.isArray(input)) return input.map(transformDates);

        return Object.fromEntries(
          Object.entries(input).map(([key, value]) => {
            return [key, transformDates(value)];
          }),
        );
      }

      const newCredential = transformDates({
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        type: ["VerifiableCredential", credentialForms[credentialType].type],
        name: data.name,
        description: data.description,
        validFrom: data.validity?.[0],
        validUntil: data.validity?.[1],
        credentialSubject: data.credentialSubject,
      });

      await API.createCredential(newCredential as CreateCredentialDto);

      close();
      router.invalidate();
    } catch (err) {
      console.error(err);
      message.error(
        "Encountered an error while trying to create the credential.",
      );
    }
    setSubmitting(false);
  };

  return (
    <Modal
      open={open}
      title="Issue a new credential"
      onCancel={close}
      onOk={submit}
      okButtonProps={{ loading: submitting }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Credential Name"
          name="name"
          required
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Credential Description"
          name="description"
          required
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Validity Period" name="validity">
          <DatePicker.RangePicker
            showTime={{ format: "HH:mm" }}
            allowEmpty
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Divider orientation="horizontal" titlePlacement="end">
          <Select
            value={credentialType}
            options={Object.keys(credentialForms).map((key) => ({
              key,
              label: key,
              value: key,
            }))}
            onChange={(val) => setCredentialType(val)}
            popupMatchSelectWidth={false}
          />
        </Divider>

        {credentialForms[credentialType].form}
      </Form>
    </Modal>
  );
};

export default CredentialCreationModal;
