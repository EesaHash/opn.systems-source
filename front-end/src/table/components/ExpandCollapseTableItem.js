import React, { useState } from 'react';
import "../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

export const ExpandCollapseTableItem = (props) => {
    const [itemClassName, setItemClassName] = useState("collapsed-table-item");
    const expandCollapseBtn = _ => {
        if(itemClassName === "collapsed-table-item")
            setItemClassName("expanded-table-item");
        else
            setItemClassName("collapsed-table-item");
    };
    return(
        <div key = {props.index} className={itemClassName}>
            <h2>{props.index}</h2>
            <div style={{display: "grid"}}>
                <h1>{props.title}</h1>
                {itemClassName === "expanded-table-item" && 
                    Object.keys(props.data).map((data, index) => (
                        expandSubItem(props.index, index, data, Object.entries(props.data)[index][1])
                    ))
                }
                {(props.editStatus && itemClassName === "expanded-table-item") && 
                    <div className='edit'>
                        <div className='edit-suggestion'>
                            <button>Regenerate</button>
                            <h3><img src="./images/loadingIcon.png" alt = "icon"/>AI powered</h3>
                        </div>
                        <div className='edit-prompt'>
                            <img src="./images/loadingIcon.png" alt = "icon"/>
                            <input type='text' placeholder='Ask AI to write anything' />
                            <button>Send</button>
                        </div>
                    </div>
                }
            </div>
            <button onClick={expandCollapseBtn}>
                {itemClassName === "collapsed-table-item" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
            </button>
        </div>
    );
};

const expandSubItem = (index1, index2, title, data) => {
    return(
        <div key = {index2} className='expanded-table-subitem'>
            <h2>{`${index1}.${index2 + 1}.`}</h2>
            <div className='expanded-table-subitem-content'>
                <h1>{title}</h1>
                {
                    Array.isArray(data) ? 
                    arraySubItem(data) :
                    <h3>{data}</h3>
                }
            </div>
        </div>
    );
};
const arraySubItem = (data) => {
    return(
        <div>
            {data.map((data, index) => (
                <div className='expanded-table-sub-subitem'>
                    <h1>{`Step ${index + 1}`}</h1>
                    <h1 style={{minWidth: "5px", margin: 0}}>:</h1>
                    <h3>{data}</h3>
                </div>
            ))}
        </div>
    );
};
