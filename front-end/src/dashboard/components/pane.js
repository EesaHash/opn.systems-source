import React from "react";
import "../style/pane.css";

export const Pane = (props) => {
    return(
        <div className="mainbox">
            <button className="addButton" onClick={props.createNewBusinessForm}> + Add Business </button>
        </div>
    );
}