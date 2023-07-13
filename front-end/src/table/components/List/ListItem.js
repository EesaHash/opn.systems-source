import React, { useState } from 'react';
import "../../style/table.css";

export const ListItem = (props) => {
    const [itemClassName, setItemClassName] = useState("minimised");
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;

    const expandMinimisedBtn = _ => {
        if(itemClassName === "minimised")
            setItemClassName("expanded");
        else
            setItemClassName("minimised");
    };
    return(
        <div className={`fifth-table-list ${itemClassName}`} onClick = {expandMinimisedBtn}>
            <h2>{props.listTitle}</h2>
            { itemClassName !== "minimised" && 
            props.list.map((data, index) => (
                (data.length > 0) && (
                    pattern.test(data) ? (
                        <div key={index} className='fifth-table-list-item'>
                            <h3>{index + 1}</h3>
                            <text>{data.substring(data.indexOf('.') + 2)}</text>
                        </div>
                    ) : (
                        pattern2.test(data) ? (
                            <div key={index} className='fifth-table-list-item'>
                                <h3>-</h3>
                                <text>{data.substring(2)}</text>
                            </div>
                        ) : (
                            <div key={index} className='fifth-table-list-item'>
                                <h3>-</h3>
                                <text>{data}</text>
                            </div>
                        )
                    )
                )
            ))}
        </div>
    );
};