import { Fragment, useState, type ReactNode } from "react";

import { Typography, Divider, Grid as AntGrid } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Grid from "./grid";
import gridStyles from "./grid.module.scss";
import cn from "classnames";

export type KeyValueListEntryProps = {
  label?: string;
  value?: ReactNode;
  children?: KeyValueListEntryProps[];
};

type KeyValueListProps = {
  data: KeyValueListEntryProps[];
};

const KeyValueListEntry: React.FC<KeyValueListEntryProps> = ({
  label,
  value,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { xs } = AntGrid.useBreakpoint();

  return (
    <>
      <Typography.Text
        strong
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn({ [gridStyles.GridColumnFillRow]: !label && !value })}
        style={{
          textAlign: !label ? "center" : "left",
          marginRight: "15px",
        }}
      >
        {isExpanded && <MinusOutlined style={{ paddingRight: "5px" }} />}
        {!isExpanded && children?.length && (
          <PlusOutlined style={{ paddingRight: "5px" }} />
        )}

        {label}
      </Typography.Text>

      {value && (
        <Typography.Text style={{ textAlign: xs ? "left" : "right" }}>
          {value}
        </Typography.Text>
      )}
      {isExpanded && children && (
        <div
          className={gridStyles.GridColumnFillRow}
          style={{
            width: "100%",
            margin: "20px 0",
            padding: "0 30px",
            boxSizing: "border-box",
          }}
        >
          <KeyValueList data={children} />
        </div>
      )}
    </>
  );
};

const KeyValueList: React.FC<KeyValueListProps> = ({ data }) => {
  return (
    <Grid colLayout="auto auto">
      {data.map((item, index) => (
        <Fragment key={item.label || index}>
          <KeyValueListEntry
            label={item.label}
            value={item.value}
            children={item.children}
          />
          {index < data.length - 1 && (
            <Divider
              orientation="horizontal"
              size="medium"
              className={gridStyles.GridColumnFillRow}
            />
          )}
        </Fragment>
      ))}
    </Grid>
  );
};

export default KeyValueList;
