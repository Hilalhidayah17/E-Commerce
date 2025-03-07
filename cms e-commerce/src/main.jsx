import { BrowserRouter, Route, Routes } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LoginPage from "./pages/admin/LoginPage.jsx";
import RegisterPage from "./pages/admin/RegisterPage.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import ReactContext from "./utils/ReactContext.jsx";

import store from "./store/store.js";
import { Provider } from "react-redux";

import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./utils/NotFound.jsx";

import DetailCard from "./components/User/DetailCard.jsx";
import ProfilPage from "./pages/User/ProfilPage.jsx";
import UserLayout from "./pages/User/UserLayout.jsx";
import { ToastContainer } from "react-toastify";
import AllPage from "./pages/user/AllPage.jsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";
import AddProductPage from "./pages/admin/crud/AddProductPage.jsx";
import EditProduct from "./pages/admin/crud/EditProduct";

createRoot(document.getElementById("root")).render(
  <ReactContext>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/all" element={<AllPage />} />
            <Route path="/:id" element={<DetailCard />} />
            <Route path="/profile" element={<ProfilPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardAdmin />} />
              <Route path="/admin/add" element={<AddProductPage />} />
              <Route path="/admin/edit/:id" element={<EditProduct />} />
            </Route>
          </Route>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ReactContext>
);
