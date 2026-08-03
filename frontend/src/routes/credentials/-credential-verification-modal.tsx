import { Alert, App, Button, Flex, Input, Modal } from "antd";
import { useState } from "react";
import API from "../../lib/api";

type CredentialVerificationModalProps = {
  open: boolean;
  onClose: () => void;
};

const CredentialVerificationModal: React.FC<
  CredentialVerificationModalProps
> = ({ open, onClose }) => {
  const [credential, setCredential] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<
    | {
      message: string;
      type: "error" | "success";
    }
    | undefined
  >();

  const { message } = App.useApp();

  const verifyCredential = async () => {
    setVerifying(true);
    try {
      await API.verifyCredential(credential);
      setResult({
        message: "The given data is a valid credential.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setResult({
        message: "The given data is not a valid credential.",
        type: "error",
      });
    }
    setVerifying(false);
  };

  const autoFormat = (toFormat: string) => {
    try {
      const object = JSON.parse(toFormat);
      setCredential(JSON.stringify(object, undefined, 2));
    } catch (err) {
      console.error(err);
      message.warning("The value in the input does not seem to be valid json.");
    }
  };

  const close = () => {
    setCredential("");
    setResult(undefined);
    setVerifying(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Verify a credential"
      onOk={verifyCredential}
      okText="Verify"
      okButtonProps={{ loading: verifying, disabled: !credential }}
      cancelText={null}
      onCancel={close}
      width={680}
      footer={(defaultButtons) => {
        return (
          <>
            <Button onClick={() => autoFormat(credential)}>Format</Button>
            {defaultButtons}
          </>
        );
      }}
    >
      <Flex orientation="vertical" gap={10}>
        {result && <Alert showIcon title={result.message} type={result.type} />}
        <Input.TextArea
          value={credential}
          rows={20}
          onChange={(e) => {
            setCredential(e.target.value);
            setResult(undefined);
          }}
          onPaste={(e) => {
            e.preventDefault();
            const value = e.clipboardData.getData("text/plain");
            autoFormat(value);
          }}
        />
      </Flex>
    </Modal>
  );
};

export default CredentialVerificationModal;
