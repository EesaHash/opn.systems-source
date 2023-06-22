import React from "react";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DonutLargeIcon/>,
        link: "dashboard",
    },
    {
        title: "Business",
        icon: <BusinessCenterIcon />,
        link: "business",
        items: [
        ]
    }
]