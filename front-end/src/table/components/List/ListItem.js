import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

export const ListItem = (props) => {
    let idx = 0;
    const [itemClassName, setItemClassName] = useState("minimised");
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;

    useEffect(() => {
        props.list.forEach((value, index, arr) => {
            arr[index] = value.trim();
        });
    }, [props.list]);

    const expandMinimisedBtn = _ => {
        if(itemClassName === "minimised")
            setItemClassName("expanded");
        else
            setItemClassName("minimised");
    };
    return(
        <div className={`list-table4-list ${itemClassName}`} onClick = {() => itemClassName === "minimised" && expandMinimisedBtn()}>
            <div style={{display: "flex"}} onClick={expandMinimisedBtn}>
                <h2>{props.listTitle}</h2>
                <button>
                    {itemClassName === "minimised" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                </button>
            </div>
            { itemClassName !== "minimised" && 
            props.list.map((data, index) => (
                (data.length > 0) && (
                    pattern.test(data) ? (
                        <div key={index} className='list-table4-list-item'>
                            <h3>{++idx}</h3>
                            <text>{data.substring(data.indexOf('.') + 2)}</text>
                        </div>
                    ) : (
                        pattern2.test(data) ? (
                            <div key={index} className='list-table4-list-item'>
                                <h3>-</h3>
                                <text>{data.substring(2)}</text>
                            </div>
                        ) : (
                            <div key={index} className='list-table4-list-item'>
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