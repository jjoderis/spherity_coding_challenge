import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Empty,
  Table,
  type TableColumnType,
  Grid,
  Modal,
  App,
  Button,
  Space,
  Statistic,
  Card,
  Flex,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HeaderContentLayout from "../../components/header-content-layout";
import CredentialCreationModal from "./-credential-creation-modal";
import { useMemo, useState } from "react";
import CredentialVerificationModal from "./-credential-verification-modal";
import API from "../../lib/api";
import type { VerifiableCredential } from "../../../../backend/src/credentials/interfaces/credentials.interface";

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

  const { xs } = Grid.useBreakpoint();
  const { message } = App.useApp();
  const router = useRouter();

  const [showCreationModal, setShowCreationModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const columns: TableColumnType[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      render: (value, record) => (
        <Link
          to="/credentials/$credentialId"
          params={{ credentialId: record.id }}
          style={{ color: "inherit" }}
        >
          <div>{value}</div>
        </Link>
      ),
    },
  ];

  if (!xs) {
    columns.push(
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (value, record) => (
          <Link
            to="/credentials/$credentialId"
            params={{ credentialId: record.id }}
            style={{ color: "inherit" }}
          >
            <div>{value}</div>
          </Link>
        ),
      },
      {
        title: "Issuer",
        dataIndex: "issuer",
        key: "issuer",
        render: (value, record) => (
          <Link
            to="/credentials/$credentialId"
            params={{ credentialId: record.id }}
            style={{ color: "inherit" }}
          >
            <div>{value}</div>
          </Link>
        ),
      },
    );
  }

  const deleteCredential = (id: string, name: string) => {
    Modal.confirm({
      title: <span>Deleting "{name}"</span>,
      content: (
        <span>Are you sure that you want to delete this credential?</span>
      ),
      onOk: async () => {
        try {
          await API.deleteCredential(id);
          router.invalidate();
        } catch (err) {
          console.error(err);
          message.error(
            `Encountered an error while trying to delete "${name}"`,
          );
        }
      },
    });
  };

  columns.push({
    title: "",
    key: "actions",
    render: (_, record) => (
      <div style={{ textAlign: "center" }}>
        <DeleteOutlined
          onClick={() => deleteCredential(record.id, record.name)}
        />
      </div>
    ),
  });

  const validCredentials = useMemo(() => {
    return credentials.filter((credential: VerifiableCredential) => {
      if (!credential.validFrom && !credential.validUntil) return true;
      if (credential.validFrom) {
        const validFrom = new Date(credential.validFrom);
        if (time < validFrom.getTime()) return false;
      }
      if (credential.validUntil) {
        const validUntil = new Date(credential.validUntil);
        if (validUntil.getTime() < time) return false;
      }

      return true;
    });
  }, [credentials, time]);

  return (
    <>
      <HeaderContentLayout title="Credentials">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          <Flex gap={10}>
            <Card style={{ flexGrow: 1 }}>
              <Statistic title="#Credentials" value={credentials.length} />
            </Card>
            <Card style={{ flexGrow: 1 }}>
              <Statistic
                title="#Active Credentials"
                value={validCredentials.length}
              />
            </Card>
          </Flex>
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
          <Table
            rowKey="id"
            dataSource={credentials}
            columns={columns}
            pagination={false}
            locale={{
              emptyText: <Empty description="You have no credentials yet!" />,
            }}
          />
        </div>
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
