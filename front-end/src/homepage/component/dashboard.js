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
            <meta charSet="UTF-8"></meta>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

            <link rel="stylesheet" href="dashboard.css"></link>
        </head>
        <body>
            <nav className="sidebar"></nav>
        </body>
       </html>
    );
};