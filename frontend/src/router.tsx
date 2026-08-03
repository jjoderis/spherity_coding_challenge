import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Button, Result } from "antd";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: (err) => (
    <Result
      status={404}
      title={typeof err.data === "string" ? err.data : "Not found"}
    />
  ),
  defaultErrorComponent: (err) => {
    console.log(err);
    return (
      <Result
        status={500}
        title={
          <>
            <div>Something went wrong</div>
            <Button type="primary" onClick={() => err.reset()}>
              Reset
            </Button>
          </>
        }
      />
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
