import React from "react";
import { Link } from "react-router-dom";
import "../comp_css/Footer.css"; // Optional for additional styles

const Footer = () => {
  return (
    <div className="footer">
      <ul className="flex justify-center space-x-6">
        <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
        <li><Link to="/terms-of-sale" className="hover:underline">Terms of Sale</Link></li>
        <li><Link to="/careers" className="hover:underline">Careers</Link></li>
        <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
      </ul>
    </div>
  );
};
export default Footer;
