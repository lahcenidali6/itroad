import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import PublicRoute from "./PublicRoute.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Documents from "./pages/Documents.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import SignUp from "./pages/SignUp.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            index: true, // for "/"
            element: <Login />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <SignUp />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                index: true,
                element: <Profile />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "documents",
                element: <Documents />,
              },
            ],
          },
        ],
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
