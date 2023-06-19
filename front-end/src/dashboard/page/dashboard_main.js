import React from "react";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/dashboard_main.css";
import "../style/empty_pane.css";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search";
import { empty } from "../components/empty_pane";


export const Dashboard_Page = () => {
    /*let flag = true;
    if (flag) {
        return (
            <>
            <div className = "empty_page"></div>
            </>
        );
    }
    else {*/
    return (
        <body>
            <div>
            <SearchBar></SearchBar>
        </div>
        <div>
            <Sidebar></Sidebar>
        </div>
        <div>
            <empty_pane></empty_pane>
        </div>
        </body>
    );
    }


