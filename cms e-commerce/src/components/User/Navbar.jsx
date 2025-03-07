import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { GlobalContext } from "../../utils/ReactContext";
import { Heart, LoaderCircle, Menu, Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AccountDemo from "../materialUi/Account";
import BasicMenu from "../materialUi/Menu";
import logo from "../../assets/logo/onFeet.png";
import {
  readProductsThunk,
  setLoading,
  setParams,
} from "../../store/productSlice";
import ModalCart from "./ModalCart";
import {
  collection,
  where,
  query as que,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { params } = useSelector((state) => state.product);
  const { isAuthenticated } = useContext(GlobalContext);
  const { userData } = useContext(GlobalContext);
  const [productCart, setProductCart] = useState([]);

  const handleSearch = () => {
    dispatch(setParams({ query }));
    dispatch(readProductsThunk({ ...params, query }));
  };

  useEffect(() => {
    const readCartItem = async () => {
      dispatch(setLoading(true));
      const q = que(
        collection(db, "cart"),
        where("userId", "==", userData.userId)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const cartItems = [];
        querySnapshot.forEach((doc) => {
          cartItems.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setProductCart(cartItems);
        dispatch(setLoading(false));
      });
      return () => unsubscribe();
    };
    if (userData?.userId) {
      readCartItem();
    }
  }, [dispatch, userData]);

  return (
    <nav className="flex items-center justify-between text-black px-6 md:px-12 py-2 shadow-lg fixed z-10 bg-white w-full">
      <div className="text-lg font-semibold w-fit">
        <Link to={"/"}>
          <img src={logo} alt="logo" className="w-30" />
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden flex justify-center items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Login & Register di mobile */}
        {!isAuthenticated ? (
          <>
            <Link to="/admin/login" className="py-2">
              Sign-In
            </Link>
            <Link to="/admin/register" className="py-2">
              Sign-Up
            </Link>
          </>
        ) : (
          <AccountDemo setProductCart={setProductCart} />
        )}

        <Menu size={28} />
      </button>

      <div className="hidden md:flex w-2/3 justify-between">
        {/* Search Box */}
        <div className="relative flex-grow">
          <Search
            className="absolute lg:right-48 md:right-2 mt-2 cursor-pointer"
            size={24}
            onClick={handleSearch}
          />
          <input
            type="text"
            className="border border-gray-300 py-2 w-full md:w-96 rounded-sm px-4"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Akun & Cart */}
        <div className="flex gap-4 justify-center items-center">
          <BasicMenu />
          {!isAuthenticated ? (
            <>
              <Link to="/admin/login">
                <div className="flex gap-2">
                  <User />
                  <p>Sign-In</p>
                </div>
              </Link>
              <p>|</p>
              <Link to="/admin/register">
                <p>Sign-Up</p>
              </Link>
            </>
          ) : (
            <AccountDemo setProductCart={setProductCart} />
          )}

          {/* Cart */}
          <div className="relative">
            {productCart.length > 0 && (
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse absolute right-[-3px] top-[-1px]"></div>
            )}
            <ModalCart products={productCart} />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex  items-center py-4 px-2 md:hidden">
          {/* Search di mobile */}
          <div className="relative w-full">
            <Search
              className="absolute right-4 mt-2 cursor-pointer"
              size={24}
              onClick={handleSearch}
            />
            <input
              type="text"
              className="border border-gray-300 py-2 w-[320px] rounded-sm px-2 ml-2"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <ModalCart products={productCart} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
