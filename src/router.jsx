import React from "react";
import { createBrowserRouter, Outlet, Navigate } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Favorites from "./pages/Favorites.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import { getToken } from "./api/client.js";
import CreateProduct from "./pages/CreateProduct.jsx";
import EditProfile from "./pages/EditProfile.jsx";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <Products /> },
      {
        path: "/products/new",
        element: (
          <Protected>
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/products/edit/:id",
        element: (
          <Protected>
            <CreateProduct />
          </Protected>
        ),
      },
      { path: "/products/:id", element: <ProductDetail /> },
      {
        path: "/favorites",
        element: (
          <Protected>
            <Favorites />
          </Protected>
        ),
      },
      {
        path: "/cart",
        element: (
          <Protected>
            <Cart />
          </Protected>
        ),
      },
      {
        path: "/checkout",
        element: (
          <Protected>
            <Checkout />
          </Protected>
        ),
      },
      {
        path: "/checkout/success/:id",
        element: (
          <Protected>
            <CheckoutSuccess />
          </Protected>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <Protected>
            <EditProfile />
          </Protected>
        ),
      },
    ],
  },
]);

export default router;
