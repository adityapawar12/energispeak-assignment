import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Root from "./routes/root";
import CreateUserPage from "./routes/user-info/create-user-page";
import UpdateUserPage from "./routes/user-info/update-user-page";
import ListUsersPage from "./routes/user-info/list-users-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/users",
    element: <ListUsersPage />,
  },
  {
    path: "/users/create",
    element: <CreateUserPage />,
  },
  {
    path: "/users/update/:id",
    element: <UpdateUserPage />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
