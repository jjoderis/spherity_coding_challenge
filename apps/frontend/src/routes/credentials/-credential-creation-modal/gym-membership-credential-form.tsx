import { DatePicker, Flex, Form, Input, Select } from "antd";

const GymMembershipCredentialForm: React.FC = () => {
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
        name={["credentialSubject", "membership-level"]}
        label="Membership"
        initialValue={"s"}
      >
        <Select
          options={[
            {
              label: "S",
              title: "1 entry per week",
              value: "s",
            },
            {
              label: "M",
              title: "Unlimited entries per week",
              value: "m",
            },
            {
              label: "L",
              title: "Unlimited entries per week + extra courses",
              value: "l",
            },
          ]}
        />
      </Form.Item>
    </>
  );
};

export default GymMembershipCredentialForm;
