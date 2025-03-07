import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

export const GlobalContext = createContext(null);
const ReactContext = ({ children }) => {
  const [login, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLogin(user);
      if (user) {
        // Hanya fetch data jika user login
        const userRef = doc(db, "users", user.uid);
        const querySnapshot = await getDoc(userRef);
        if (querySnapshot.exists()) {
          setUserData({ ...querySnapshot.data(), userId: user.uid });
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loading]);

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  };

  return (
    <GlobalContext.Provider
      value={{
        login,
        setLoading,
        loading,
        userData,
        isAuthenticated: !!login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default ReactContext;
