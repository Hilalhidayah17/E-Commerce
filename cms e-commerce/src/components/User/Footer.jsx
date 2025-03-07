import {
  FaSquareYoutube,
  FaSquareInstagram,
  FaSquareXTwitter,
} from "react-icons/fa6";

import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#343131] text-white">
        {/* Grid Container */}
        <div className="px-8 md:px-16 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center md:text-left">
          {/* Section 1: Branding & Social Media */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Every Steps Matter</h2>
            <div className="flex justify-center md:justify-start gap-3">
              <FaSquareYoutube
                size={28}
                className="hover:text-red-500 transition-all"
              />
              <FaSquareInstagram
                size={28}
                className="hover:text-pink-500 transition-all"
              />
              <FaSquareXTwitter
                size={28}
                className="hover:text-gray-400 transition-all"
              />
            </div>
          </section>

          {/* Section 2: About */}
          <section>
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  About STEPS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Sitemap
                </a>
              </li>
            </ul>
          </section>

          {/* Section 3: Orders */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Orders</h2>
            <ul>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Track My Order
                </a>
              </li>
            </ul>
          </section>

          {/* Section 4: Help */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400 transition-all">
                  Contact Us
                </a>
              </li>
            </ul>
          </section>
        </div>

        {/* Divider */}
        <hr className="border-t border-slate-500 w-[90%] mx-auto" />

        {/* Copyright */}
        <div className="py-4 text-center text-sm">
          <p>Copyright © 2025 Steps. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
