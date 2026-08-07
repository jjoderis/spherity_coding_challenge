import { Link, useRouter } from "@tanstack/react-router";
import { App, Empty, Grid, Modal, Table, type TableColumnType } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { VerifiableCredential } from "@scc/backend/types/credentials";

import API from "../../lib/api";

type CredentialsTableProps = {
  credentials: VerifiableCredential[];
};

const CredentialLink: React.FC<{ credentialId: string; text: string }> = ({
  credentialId,
  text,
}) => {
  return (
    <Link
      to="/credentials/$credentialId"
      params={{ credentialId }}
      style={{ color: "inherit" }}
    >
      <div>{text}</div>
    </Link>
  );
};

const CredentialsTable: React.FC<CredentialsTableProps> = ({ credentials }) => {
  const { xs } = Grid.useBreakpoint();
  const { message } = App.useApp();
  const router = useRouter();

  const columns: TableColumnType[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      render: (value, record) => (
        <CredentialLink credentialId={record.id} text={value} />
      ),
    },
  ];

  if (!xs) {
    //  only show the name on very small screens
    columns.push(
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (value, record) => (
          <CredentialLink credentialId={record.id} text={value} />
        ),
      },
      {
        title: "Issuer",
        dataIndex: "issuer",
        key: "issuer",
        render: (value, record) => (
          <CredentialLink credentialId={record.id} text={value} />
        ),
      },
    );

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
  }

  return (
    <Table
      rowKey="id"
      dataSource={credentials}
      columns={columns}
      pagination={false}
      locale={{
        emptyText: <Empty description="You have no credentials yet!" />,
      }}
    />
  );
};

export default CredentialsTable;
