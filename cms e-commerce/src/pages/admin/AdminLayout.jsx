import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import DashboardAdmin from "./DashboardAdmin";
import NavbarAdmin from "../../components/admin/NavbarAdmin";

const AdminLayout = () => {
  return (
    <div>
      <ToastContainer />
      <NavbarAdmin />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
