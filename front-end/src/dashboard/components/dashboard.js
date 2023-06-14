import React, {useEffect, useState} from "react";
import "../style/dashboard.css";
import { getUserID, logOut } from "../../App";
import { ForgotPassword } from "../../account/components/ForgotPassword";


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
                 <div className="search-bar">
                    <input type="text" id="searchInput" placeholder= " &#xF002; Search for businesses, CCF, SOPs or keywords" />
                </div>
                <div className="box_main">
                    <div className="search-bar"></div>
                    <div className="box2">
                    
                    </div>
                    <div className="box3">
                        <div className="smalllogo"><h5>opn.system</h5></div>

                     </div>
                 </div> 
        </body> 
    );
};

/*export const SideBar() => {

    return (
    );*/
