import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { EditPrompt } from '../EditPrompt';

export const ExpandMinimisedTableItem2 = (props) => {
    const [itemClassName, setItemClassName] = useState(props.itemClassName);
    useEffect(() => {
        setItemClassName(props.itemClassName);
    }, [props.itemClassName]);
    const expandMinimisedBtn = _ => {
        if(itemClassName === "minimised")
            setItemClassName("expanded");
        else
            setItemClassName("minimised");
    };
    return(
        <div key={props.index} className={`list-table4-list-item${props.isEditSelected(props.index) ? " active" : ""}`} onClick={() => itemClassName === "minimised" && expandMinimisedBtn()}>
            <h3>{props.data.hyphen}</h3>
            <div style={{width:"100%", display: "grid"}}>
                <div className={`${props.isEditSelected(props.index) ? "edit-selected" : ""}`} style={{marginBottom: props.isEditSelected(props.index) ? "15px" : "0"}} onClick={() => props.setSelectedStep(props.index)}>
                    <div style={{display: "flex"}} className={props.data.item.length > 0 ? "heading" : ""} onClick={expandMinimisedBtn} >
                        <text>{props.data.heading}</text>
                        {props.data.item.length > 0 &&
                            <button>
                                {itemClassName === "minimised" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                            </button>
                        }
                    </div>
                    {itemClassName !== "minimised" &&
                        props.data.item.map((item, index) => (
                            <div className='sub-items'>
                                {index > 0 && <hr/>}
                                <div className='sub-items-content'>
                                    <h3>{item.hyphen}</h3>
                                    <text>{item.data}</text>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {props.isEditSelected(props.index) && <EditPrompt index = {props.index}/>}
            </div>
        </div>
    );
};