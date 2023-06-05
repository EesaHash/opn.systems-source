import React, {useEffect, useState} from "react";
import "../style/dashboard.css";
import { getUserID } from "../../App";

export const Dashboard = _ => {
    const [userID, setUserID] = useState();

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);

    if(userID === "none") return window.location.href = "/signin";
    return(
        <section>
            
        </section>
    );
};