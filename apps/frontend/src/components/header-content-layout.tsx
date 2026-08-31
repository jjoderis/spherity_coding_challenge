import { Link } from "@tanstack/react-router";
import { Button, Layout, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./header-content-layout.module.scss";

const { Header, Content } = Layout;

type HeaderContentLayoutProps = React.PropsWithChildren<{
  title?: string;
  backLink?: React.ComponentProps<typeof Link>["to"];
}>;

/**
 * The default layout of our pages with a header row that contains information about the current page and a main area containing the pages content
 */
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
      <Content className={styles.Content}>
        <div className={styles.Main}>{children}</div>
      </Content>
    </Layout>
  );
};

export default HeaderContentLayout;
