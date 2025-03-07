import * as React from "react";
import {
  AuthenticationContext,
  SessionContext,
} from "@toolpad/core/AppProvider";
import { Account } from "@toolpad/core/Account";
import { GlobalContext } from "../../utils/ReactContext";

const AccountDemo = ({ setProductCart }) => {
  const [session, setSession] = React.useState(null);

  const { userData, logout, isAuthenticated } = React.useContext(GlobalContext);

  // Update session otomatis saat userData atau isAuthenticated berubah
  React.useEffect(() => {
    if (isAuthenticated && userData) {
      setSession({
        user: {
          name: userData.firstName + userData.lastName,
          email: userData.email,
          image: userData.images,
        },
      });
    } else {
      setSession(null);
    }
  }, [isAuthenticated, userData]);

  const authentication = React.useMemo(() => {
    return {
      signOut: () => {
        logout();
        setSession(null);
        setProductCart([]);
      },
    };
  }, [logout]);

  return (
    <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>
        {/* preview-start */}
        <Account />
        {/* preview-end */}
      </SessionContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export default AccountDemo;
