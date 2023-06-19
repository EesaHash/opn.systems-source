import React from "react";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/dashboard_main.css";
import "../style/empty_pane.css";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search";
import { EmptyPane } from "../components/empty_pane";

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
    <div className="background">
    <div className="bash">
        <Sidebar> </Sidebar>
    </div>
    <div>
    <div className="SEARCH">
        <SearchBar />
    </div>
    <div className="pane" style={{ padding: "1%" }}>
        <EmptyPane />
    </div>
    </div>

    </div>
    );
    }


