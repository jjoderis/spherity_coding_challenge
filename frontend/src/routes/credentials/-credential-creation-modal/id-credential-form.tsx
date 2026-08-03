import { DatePicker, Flex, Form, Input } from "antd";

const IdCredentialForm: React.FC = () => {
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

      <Form.Item
        name={["credentialSubject", "date-of-birth"]}
        label="Date of birth"
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name={["credentialSubject", "nationality"]}
        label="Nationality"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={["credentialSubject", "place-of-birth"]}
        label="Place of birth"
      >
        <Input />
      </Form.Item>

      <Flex gap={10}>
        <Form.Item
          name={["credentialSubject", "address", "postal-code"]}
          label="Postal code"
          style={{ flexGrow: 1 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["credentialSubject", "address", "city"]}
          label="City"
          style={{ flexGrow: 1 }}
        >
          <Input />
        </Form.Item>
      </Flex>

      <Form.Item
        name={["credentialSubject", "address", "street-address"]}
        label="Street address"
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default IdCredentialForm;
