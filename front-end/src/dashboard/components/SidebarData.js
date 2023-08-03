import React from "react";
import BusinessIcon from '../svg/businessIcon';
import DashboardIcon from '../svg/dashboardIcon';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon/>,
        link: "dashboard",
    },
    {
        title: "Business",
        icon: <BusinessIcon />,
        link: "business",
        items: [
        ]
    }
]