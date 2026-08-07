import { createFileRoute } from "@tanstack/react-router";
import { Button, Space } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import HeaderContentLayout from "../../components/header-content-layout";
import CredentialCreationModal from "./-credential-creation-modal";
import { useState } from "react";
import CredentialVerificationModal from "./-credential-verification-modal";
import API from "../../lib/api";
import CredentialsTable from "./-credentials-table";
import CredentialsStats from "./-credentials-stats";

export const Route = createFileRoute("/credentials/")({
  loader: async () => {
    const time = Date.now();
    const credentials = await API.getCredentials();
    return { time, credentials };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { time, credentials } = Route.useLoaderData();

  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  return (
    <>
      <HeaderContentLayout title="Credentials">
        <CredentialsStats currentTime={time} credentials={credentials} />
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setShowCreationModal(true)}
            type="primary"
          >
            Issue Credential
          </Button>
          <Button
            icon={<SearchOutlined />}
            onClick={() => setShowVerificationModal(true)}
          >
            Verify Credential
          </Button>
        </Space>
        <CredentialsTable credentials={credentials} />
      </HeaderContentLayout>
      <CredentialCreationModal
        open={showCreationModal}
        onClose={() => setShowCreationModal(false)}
      />
      <CredentialVerificationModal
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />
      ;
    </>
  );
}
