import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";

import c from "@/utils/c.ts";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <main className={c("w-svw", "h-svh", "min-w-", "flex", "flex-col")}>
        <Header />
        <Outlet />
      </main>

      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});
