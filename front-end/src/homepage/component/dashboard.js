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
        <body>
          <div className="container">
            <div className="navigation">
                <ul>
                    <li>
                        <a href="#">
                            <span className="icon"><ion-icon name="pie-chart-outline"></ion-icon></span>
                            <span className="title">Opn.Systems</span>
                        </a>
                    </li>
                    <li>
                    <a href="#">
                            <span className="icon"><ion-icon name="pie-chart-outline"></ion-icon></span>
                            <span className="title">Dashboard</span>
                        </a>
                    </li>
                    <li>
                    <a href="#">
                            <span className="icon"></span>
                            <span className="title">Add Business</span>
                        </a>
                    </li>
                   
                </ul>
            </div>
            </div>  
        <script src=".../opn. systems project/opn.systems-source/front-end/src/homepage/component/Dashboard.js"></script>
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script> 
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
        </body>
    );
};