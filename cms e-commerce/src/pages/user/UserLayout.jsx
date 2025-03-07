import React from "react";
import Navbar from "../../components/User/Navbar";
import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default UserLayout;
