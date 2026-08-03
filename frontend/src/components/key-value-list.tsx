import { Fragment, useState, type ReactNode } from "react";

import { Typography, Divider, Grid as AntGrid } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import Grid from "./grid";
import styles from "./key-value-list.module.scss";
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

/**
 * Component representing one row in the KeyValueList
 * Might create nested KeyValueLists if the visualized entry represents an object
 */
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
        // in case of arrays we might have entries that are objects which we want to be able to collapse and expand
        className={cn({ [gridStyles.GridColumnFillRow]: !label && !value })}
        style={{
          textAlign: !label ? "center" : "left",
          marginRight: "15px",
        }}
      >
        {isExpanded && <MinusOutlined className={styles.ExpansionButton} />}
        {!isExpanded && children?.length && (
          <PlusOutlined className={styles.ExpansionButton} />
        )}

        {label}
      </Typography.Text>

      {value && (
        <Typography.Text style={{ textAlign: xs ? "left" : "right" }}>
          {value}
        </Typography.Text>
      )}
      {isExpanded && children && (
        <div className={cn(gridStyles.GridColumnFillRow, styles.NestedList)}>
          <KeyValueList data={children} />
        </div>
      )}
    </>
  );
};

/**
 * A component to visualize generic objects
 */
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
