import { Link } from "@tanstack/react-router";
import { Button, Layout, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./header-content-layout.module.scss";

const { Header, Content } = Layout;

type HeaderContentLayoutProps = React.PropsWithChildren<{
  title?: string;
  backLink?: React.ComponentProps<typeof Link>["to"];
}>;

const HeaderContentLayout: React.FC<HeaderContentLayoutProps> = ({
  title,
  backLink,
  children,
}) => {
  return (
    <Layout className={styles.Layout}>
      <Header className={styles.Header}>
        {backLink && (
          <Link to={backLink}>
            <Button icon={<ArrowLeftOutlined />} />
          </Link>
        )}
        {title && (
          <Typography.Title className={styles.Title} level={2}>
            {title}
          </Typography.Title>
        )}
      </Header>
      <Content className={styles.Main}>{children}</Content>
    </Layout>
  );
};

export default HeaderContentLayout;
