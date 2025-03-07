import React, { useContext } from "react";
import Account from "../materialUi/Account";
import { Link } from "react-router";
import logo from "../../assets/logo/OnFeet.png";

const NavbarAdmin = () => {
  return (
    <nav className="flex flex-col md:flex-row justify-between items-center bg-white text-black px-6 md:px-14 py-3 shadow-md gap-3 md:gap-6">
      {/* Logo */}
      <div className="text-lg font-semibold tracking-wide text-center md:text-left w-full md:w-auto">
        <a href="/admin">
          <img src={logo} alt="logo" className="w-32" />
        </a>
      </div>

      {/* Menu Navigation */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full md:w-auto">
        {/* "Go to HomePage" dengan Hover Animasi */}
        <a
          href="/"
          className="relative text-lg font-medium text-gray-700 hover:text-red-600 transition duration-300"
        >
          Go to HomePage
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </a>

        {/* Account Component */}
        <Account />
      </div>
    </nav>
  );
};

export default NavbarAdmin;
