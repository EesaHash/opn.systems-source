import React from "react";
import "../style/pane.css";
import { businessDashboard } from "../../business/components/businessDashboard";

export const Pane = (props) => {
    if(props.businesses.length === 0)
        return emptyPane(props.createNewBusinessForm)
    else
        return filledPane(props.activeLink, props.activeLink2, props.createNewBusinessForm, props.businesses, props.setBusinesses, props.activeLink3, props.setActiveLink3)
};

const emptyPane = (createNewBusinessForm) => {
    return(
        <div className="mainbox">
            <button className="addButton" onClick={createNewBusinessForm}> + Add Business </button>
        </div>
    );
};
const filledPane = (activeLink, activeLink2, createNewBusinessForm, businesses, setBusinesses, activeLink3, setActiveLink3) => {
    switch(activeLink){
        case "business":
            if(activeLink2)
                return businessDashboard(activeLink2, businesses, activeLink3, setActiveLink3);
            else{
                return emptyPane(createNewBusinessForm);
            }
        default:
            return emptyPane(createNewBusinessForm);
    }
};