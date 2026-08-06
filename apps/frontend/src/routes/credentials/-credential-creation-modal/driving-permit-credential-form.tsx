import { DatePicker, Flex, Form, Input } from "antd";

const DrivingPermitCredentialForm: React.FC = () => {
  return (
    <>
      <Flex gap={10}>
        <Form.Item
          name={["credentialSubject", "name"]}
          label="Name At Birth"
          style={{ flexGrow: 1 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["credentialSubject", "given-names"]}
          label="Given Names"
          style={{ flexGrow: 1 }}
        >
          <Input />
        </Form.Item>
      </Flex>

      <Flex gap={10}>
        <Form.Item
          name={["credentialSubject", "date-of-birth"]}
          label="Date of birth"
          style={{ flexGrow: 1 }}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name={["credentialSubject", "place-of-birth"]}
          label="Place of birth"
          style={{ flexGrow: 1 }}
        >
          <Input />
        </Form.Item>
      </Flex>

      <Form.Item
        name={["credentialSubject", "vehicle-classes"]}
        label="Vehicle Classes"
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default DrivingPermitCredentialForm;
