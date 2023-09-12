import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./pages/Evergreen.jsx";
import "./index.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>No entrypoint selected.</div>,
  },
  { path: "/:entrypoint", element: <App /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
