import React from 'react';
import "../style/table.css";

export const EmptyTableContent = (props) => {
    return(
        <div className='empty-table'>
            <div className='empty-table-content'>
                <img src = "./images/emptyListIcon.png" alt="icon"/>
                <h2>Oops, it's empty</h2>
                <button onClick={props.addNewBtn}>{props.buttonTitle}</button>
            </div>
        </div>
    );
};