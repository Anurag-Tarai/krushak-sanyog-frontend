import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900/60 text-gray-400 py-3 border-t border-green-800/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-xs">
        {/* Links */}
        <ul className="flex flex-wrap justify-center md:justify-start space-x-4 md:mb-0">
          <li>
            <Link to="/privacy-policy" className="hover:text-green-400 transition">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms-of-sale" className="hover:text-green-400 transition">
              Terms of Sale
            </Link>
          </li>
          <li>
            <Link to="/careers" className="hover:text-green-400 transition">
              Careers
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-green-400 transition">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Branding */}
        <p className="text-center text-[11px] text-gray-500 mt-2 md:mt-0">
          © {new Date().getFullYear()} Farmer Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
