import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
    {
        title: "Home",
        path: "/home",
        icon: <AiIcons.AiFillHome />,
        cName: "nav-text"
    },
    {
        title: "Upload",
        path: "/upload",
        icon: <FaIcons.FaUpload />,
        cName: "nav-text"
    },
    {
        title: "Modify Attributes",
        path: "/modify-attributes",
        icon: <FaIcons.FaList />,
        cName: "nav-text"
    },

    {
        title: "View Combined Data",
        path: "/view-data",
        icon: <FaIcons.FaTable />,
        cName: "nav-text"
    },
    {
        title: "Derive Logic",
        path: "/",
        icon: <FaIcons.FaArrowCircleRight />,
        cName: "nav-text"
    },
    {
        title: "Analyzed Reports",
        path: "/reports",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text"
    },
    {
        title: "Sign Out",
        path: "/",
        icon: <FaIcons.FaSignOutAlt />,
        cName: "nav-text"
    }
];
