import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Space, Tag } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import KeyValueList, {
  type KeyValueListEntryProps,
} from "../../../components/key-value-list";
import styles from "./index.module.scss";
import HeaderContentLayout from "../../../components/header-content-layout";
import { useState } from "react";
import API from "../../../lib/api";
import CredentialSharingModal from "./-credential-sharing-modal";

export const Route = createFileRoute("/credentials/$credentialId/")({
  loader: async ({ params: { credentialId } }) => {
    return API.getCredential(credentialId);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const credential = Route.useLoaderData();

  const credentialInformation = [
    { label: "ID", value: credential.id },
    { label: "Name", value: credential.name },
    { label: "Description", value: credential.description },
    { label: "Issuer", value: credential.issuer },
    {
      label: "Issuance Date",
      value: new Date(credential.issuanceDate).toLocaleString(),
    },
    {
      label: "Valid From",
      value: credential.validFrom
        ? new Date(credential.validFrom).toLocaleString()
        : "-",
    },
    {
      label: "Valid Until",
      value: credential.validUntil
        ? new Date(credential.validUntil).toLocaleString()
        : "-",
    },
    {
      label: "Type",
      value: (
        <Space>
          {credential.type?.map((type: string) => (
            <Tag color={"cyan"}>{type}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  /**
   * Transforms a credential (and nested objects) into the format required by the visualisation component
   */
  function toKeyValueData(obj: object): KeyValueListEntryProps[] {
    if (Array.isArray(obj)) {
      return obj.map((value) => ({
        value: typeof value !== "object" ? value : undefined,
        children: typeof value === "object" ? toKeyValueData(value) : undefined,
      }));
    } else {
      return Object.entries(obj).map(([label, value]) => ({
        label,
        value: typeof value !== "object" ? value : undefined,
        children: typeof value === "object" ? toKeyValueData(value) : undefined,
      }));
    }
  }

  const credentialContent = toKeyValueData(credential.credentialSubject);
  const credentialSignature = toKeyValueData(credential.proof);

  const sections = [
    {
      title: "Credential Information",
      content: <KeyValueList data={credentialInformation} />,
    },
    {
      title: "Credential Content",
      content: <KeyValueList data={credentialContent} />,
    },
    {
      title: "Credential Signature",
      content: <KeyValueList data={credentialSignature} />,
    },
  ];

  const [showSharingModal, setShowSharingModal] = useState(false);

  return (
    <>
      <HeaderContentLayout backLink="/credentials" title={credential.name}>
        <Space>
          <Button
            icon={<ShareAltOutlined />}
            onClick={() => setShowSharingModal(true)}
          >
            Share Credential
          </Button>
        </Space>
        {sections.map((section) => (
          <Card
            key={section.title}
            title={
              <div className={styles.InfoSectionTitle}>{section.title}</div>
            }
          >
            {section.content}
          </Card>
        ))}
      </HeaderContentLayout>
      <CredentialSharingModal
        open={showSharingModal}
        onClose={() => setShowSharingModal(false)}
        credential={credential}
      />
    </>
  );
}
