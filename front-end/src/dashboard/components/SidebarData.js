import React from "react";
import BusinessIcon from '../svg/businessIcon';
import DashboardIcon from '../svg/dashboardIcon';

/**
 * Sidebar data array containing navigation links and corresponding icons.
 * Each object represents a sidebar item with title, icon, and link properties.
 * For the "Business" item, there is also an items property which can be used to store sub-items.
 */
export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "dashboard",
    },
    {
        title: "Business",
        icon: <BusinessIcon />,
        link: "business",
        items: [
            // Sub-items for the "Business" item can be added here if needed
        ]
    }
];
