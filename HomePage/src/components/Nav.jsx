import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { RxPerson } from "react-icons/rx";
import { MdMenu, MdClose } from "react-icons/md";

import './Nav.css';
import Logo from '../assets/image.png';

const Nav = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="inner1">
        <img src={Logo} width="80%" height="80%" alt="Logo" />
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
      </div>

      <div className={`inner2 ${menuOpen ? "show-menu" : ""}`}>
        <div className="inner22">
          <NavLink to='/' className={({ isActive }) => isActive ? "link active" : "link"} onClick={() => setMenuOpen(false)}>
            <AiOutlineHome /> Home
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to='/browseitems' className={({ isActive }) => isActive ? "link active" : "link"} onClick={() => setMenuOpen(false)}>
                <CiSearch /> BrowseItems
              </NavLink>
              <NavLink to='/profile' className={({ isActive }) => isActive ? "link active" : "link"} onClick={() => setMenuOpen(false)}>
                <RxPerson /> Profile
              </NavLink>
            </>
          )}

          {!isLoggedIn ? (
            <NavLink to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>Login</NavLink>
          ) : (
            <button onClick={handleLogout} className="login-btn">Logout</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
