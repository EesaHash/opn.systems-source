import React from "react";
import { Outlet } from "react-router-dom";

export const Header = _ => {
    return(
        <main>
            <header>

            </header>
            <div id="content" className="content">
                <Outlet/>
            </div>
        </main>
    );
};