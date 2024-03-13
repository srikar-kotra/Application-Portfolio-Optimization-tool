import React, { useState } from "react";

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";

import { IconContext } from "react-icons";

// ROUTING

import { Link } from "react-router-dom";

// DATA FILE
import { SidebarData } from "./SideBarData";
import { useParams } from "react-router-dom";

import Logo from "../Login/TechM-color-logo.png";
// STYLES
import "./NavBar.css";

export default function Navbar() {
    const [sidebar, setSidebar] = useState(false);
    const { username, customer_id } = useParams();
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <div className="NavBar-enclosing">
            <IconContext.Provider value={{ color: 'linear-gradient(45deg, #007bff, #00bfa5)' }}>
                {/* All the icons now are white */}
                <div className="navbar">
                    <Link to="#" className="menu-bars" style={{ color: '#00bfa5' }} >
                        <FaIcons.FaBars onClick={showSidebar} /> <span className="menu">Menu</span>
                    </Link>

                    <div className="navbar-brand nav-title h1" >Application Portfolio Optimization Tool &copy; </div>
                    <img src={Logo} alt="TechM Logo" className="nav-image"></img>
                </div>
                <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
                    <ul className="nav-menu-items" onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className="menu-bars">
                                <span className="close-icon"><AiIcons.AiOutlineClose /></span>
                            </Link>
                        </li>

                        {SidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={'/' + username + '/' + customer_id + item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider >
        </div>
    );
}
