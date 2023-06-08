import React, {useEffect, useState} from "react";
import "../style/homepage.css";
import { getUserID, logOut } from "../../App";

export const Dashboard = _ => {
    const [userID, setUserID] = useState();
     useEffect(() => {
         try{
             getUserID().then(res => setUserID(res)); 
         }catch(error){
             console.log(error);
         }
     }, []);

    if(userID === "none") return window.location.href = "/";
    return(   
        <html>
            <head>
                <link rel="stylesheet" href="dashboard.css"></link>
            </head>

            <body>
                <div className="sidebar">
                        <span className="logo_name">Opn.Systems</span>

                </div>

            </body>
            
        </html>
    );
};