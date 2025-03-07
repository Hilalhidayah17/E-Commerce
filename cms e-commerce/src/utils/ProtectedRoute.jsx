import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { GlobalContext } from "./ReactContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, userData } = useContext(GlobalContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(`/admin/login`);
    }
    if (userData.role === "user") {
      navigate("/");
    } else {
      return;
    }
  }, [isAuthenticated, loading]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
