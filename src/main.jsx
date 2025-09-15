import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./router.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
