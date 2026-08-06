import { App, Checkbox, Form, Modal, Typography } from "antd";
import Grid from "../../../components/grid";
import gridStyles from "../../../components/grid.module.scss";
import { Fragment, useState, type CSSProperties } from "react";
import API from "../../../lib/api";
import type { VerifiableCredential } from "../../../../../backend/src/credentials/interfaces/credentials.interface";

type ClaimSelectionProps = {
  path?: string;
  claims: object;
  className?: string;
  style?: CSSProperties;
};

const ClaimSelection: React.FC<ClaimSelectionProps> = ({
  path = "",
  claims,
  className,
  style,
}) => {
  return (
    <Grid colLayout="auto auto 20px" className={className} style={style}>
      {Object.entries(claims).map(([key, value]) => {
        if (!value) return;

        if (Array.isArray(value)) {
          value = JSON.stringify(value);
        } else if (typeof value === "object") {
          return (
            // visually nest nested objects
            <Fragment key={key}>
              <Typography.Text
                className={gridStyles.GridColumnFillRow}
                strong
                style={{ textAlign: "center", margin: "5px 0" }}
              >
                {key}
              </Typography.Text>
              <ClaimSelection
                path={`${path}/${key}`}
                claims={value}
                className={gridStyles.GridColumnFillRow}
                style={{ padding: "20px" }}
              />
            </Fragment>
          );
        }

        return (
          <Fragment key={key}>
            <Typography.Text strong style={{ marginRight: "10px" }}>
              {key}
            </Typography.Text>
            <Typography.Text>{value}</Typography.Text>
            <Form.Item name={`${path}/${key}`} valuePropName="checked">
              <Checkbox />
            </Form.Item>
          </Fragment>
        );
      })}
    </Grid>
  );
};

type CredentialSharingModalProps = {
  open: boolean;
  onClose: () => void;
  credential: VerifiableCredential;
};

/**
 * A modal that allows the creation of derived credentials that can be shared with others
 * Provides a UI to select which claims of a credential should be contained in the derived credential
 */
const CredentialSharingModal: React.FC<CredentialSharingModalProps> = ({
  open,
  onClose,
  credential,
}) => {
  const [form] = Form.useForm();

  const { message } = App.useApp();

  const [submitting, setSubmitting] = useState(false);
  const submit = async () => {
    setSubmitting(true);

    try {
      const data = await form.validateFields();

      const toDisclose = Object.entries(data)
        .filter(([_, value]) => !!value)
        .map(([key]) => key);

      const result = await API.shareCredential(credential.id, [
        ...toDisclose,
        "/issuer",
      ]);
      navigator.clipboard.writeText(JSON.stringify(result));
      onClose();
      message.info("Copied the shareable credential to your clipboard.");
    } catch (err) {
      console.error(err);
      message.error(
        "Encountered an error while trying to create the credential share.",
      );
    }
    setSubmitting(false);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={submit}
      okButtonProps={{ loading: submitting }}
      title="Select the information to disclose"
      // force the modal to not overflow the screen
      style={{ height: "90%" }}
      styles={{
        container: { height: "90%", display: "flex", flexDirection: "column" },
        body: { overflow: "scroll", flexGrow: 1 },
      }}
    >
      <Form form={form}>
        <ClaimSelection
          claims={{
            ...credential,
            // exclude required/default properties from the properties that can be deselected
            proof: undefined,
            "@context": undefined,
            type: undefined,
            issuer: undefined,
            id: undefined,
          }}
          style={{ padding: "10px" }}
        />
      </Form>
    </Modal>
  );
};

export default CredentialSharingModal;
