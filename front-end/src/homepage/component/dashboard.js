import React, {useState} from "react";
import "../style/homepage.css";
import { getUserID } from "../../App";

export const dashboard = _ => {
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
        <head>
            <body>
                <div className="sidebar">
                    <div className="logo">
                        <ul className="main">
                            <li>
                                <a href="#">
                                    
                                </a>
                            </li>
                        </ul>
                        </div>
                    </div>
            </body>
        </head>
        
    );
};