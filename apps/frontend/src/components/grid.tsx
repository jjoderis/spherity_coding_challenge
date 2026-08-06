import type { CSSProperties } from "react";
import styles from "./grid.module.scss";
import { Grid as AntGrid } from "antd";
import cn from "classnames";

type GridProps = React.PropsWithChildren<{
  colLayout: string;
  className?: string;
  style?: CSSProperties;
}>;

/**
 * A simple grid container component for use in other components
 */
const Grid: React.FC<GridProps> = ({
  colLayout,
  children,
  className,
  style = {},
}) => {
  const { xs } = AntGrid.useBreakpoint();

  return (
    <div
      className={cn(styles.Grid, className)}
      style={{ gridTemplateColumns: xs ? "auto" : colLayout, ...style }}
    >
      {children}
    </div>
  );
};

export default Grid;
