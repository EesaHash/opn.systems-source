import React from "react";
import "../style/pane.css";
import { businessDashboard } from "../../business/components/businessDashboard";

export const Pane = (props) => {
    if(props.businesses.length === 0)
        return emptyPane(props.createNewBusinessForm)
    else
        return filledPane(props.activeLink, props.activeLink2, props.createNewBusinessForm)
};

const emptyPane = (createNewBusinessForm) => {
    return(
        <div className="mainbox">
            <button className="addButton" onClick={createNewBusinessForm}> + Add Business </button>
        </div>
    );
};
const filledPane = (activeLink, activeLink2, createNewBusinessForm) => {
    switch(activeLink){
        case "business":
            if(activeLink2)
                return businessDashboard(activeLink2);
            else{
                return emptyPane(createNewBusinessForm);
            }
        default:
            return emptyPane(createNewBusinessForm);
    }
};