import React from 'react';
import "../style/table.css";

export const TableContent1 = (props) => {
    return(
        <div className='table-content-1'>
            {props.list.map((data, index) => (
                item(data, index, props.itemActionBtn)
            ))}
        </div>
    );
};
const item = (data, index, itemActionBtn) => {
    return(
        <div key = {index} className='table-content-1-item'>
            <button onClick={() => itemActionBtn(data)}>
                <img src="./images/documentIcon.png" alt="icon"/>
                {data.title}
            </button>
        </div>
    );
};