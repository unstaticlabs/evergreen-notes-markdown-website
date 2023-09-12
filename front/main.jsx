import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./pages/Evergreen.jsx";
import "./index.scss";
import Config from "../config.json";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <div>No entrypoint selected.</div>,
    },
    { path: "/:entrypoint", element: <App /> },
  ],
  {
    basename: window.location.host.endsWith(".github.io")
      ? `/${window.location.pathname.split("/")[1]}`
      : Config.basename,
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
