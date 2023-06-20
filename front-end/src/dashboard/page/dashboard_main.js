import React from "react";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/dashboard_main.css";
import "../style/pane.css";
import { Sidebar } from "../components/sidebar";
import { SearchBar } from "../components/search";
import { Pane } from "../components/pane";
import { Profile } from "../components/profile";

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
                <div style={{display: "flex"}}>
                    <div className="search">
                        <SearchBar />
                    </div>
                    <div className="profile">
                        <Profile />
                    </div>
                </div>
                <div className="pane">
                    <Pane />
                </div>
            </div>
        </div>
    );
}


