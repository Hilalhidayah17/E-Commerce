import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../utils/ReactContext";
import { query, where } from "firebase/firestore";

const ItemCart = async () => {
  const { userData } = useContext(GlobalContext);
  const [productCart, setProductCart] = useState([]);

  const handleReadCartItems = async () => {
    const q = query(
      collection(db, "cart"),
      where("userId", "==", userData.userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      setProductCart({ id: doc.id, ...doc.data() });
    });
  };

  useEffect(async () => {
    handleReadCartItems();
  }, []);
  console.log(productCart, "productscart");
  return <div>ItemCart</div>;
};

export default ItemCart;
