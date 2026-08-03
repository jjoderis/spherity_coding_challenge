import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { App } from "antd";

const RootLayout = () => (
  <App style={{ height: "100%" }}>
    <Outlet />
    <TanStackRouterDevtools />
  </App>
);

export const Route = createRootRoute({ component: RootLayout });
