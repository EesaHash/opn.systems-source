import React, {useEffect, useState} from "react";
import "../style/homepage.css";
import "../style/dashboard.css";
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
        <body>
            <div className="logo1">
            </div>            
        </body> 
    );
};