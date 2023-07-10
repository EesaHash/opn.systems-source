import React, { useState } from 'react';
import "../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

export const ExpandMinimisedTableItem = (props) => {
    const [itemClassName, setItemClassName] = useState("minimised-table-item");
    const expandCollapseBtn = _ => {
        if(itemClassName === "minimised-table-item")
            setItemClassName("expanded-table-item");
        else
            setItemClassName("minimised-table-item");
    };
    const sendPrompt = _ => {
        const prompt = document.getElementById(`prompt${props.index}`).value;
        if(!prompt)
            return alert("Prompt cannot be empty");
        props.regenerateByPrompt(props.title, prompt);
        document.getElementById(`prompt${props.index}`).value = "";
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            sendPrompt();
        }
    };
    return(
        <div key = {props.index} className={itemClassName} onClick={() => itemClassName === "minimised-table-item" && expandCollapseBtn()}>
            <h2>{props.index}</h2>
            <div style={{display: "grid"}}>
                    <h1 style={{width: "100%", cursor: "pointer"}} onClick={() => itemClassName === "expanded-table-item" && expandCollapseBtn()}>{props.title}</h1>
                {itemClassName === "expanded-table-item" && 
                    Object.keys(props.data).map((data, index) => (
                        expandSubItem(props.index, index, data, Object.entries(props.data)[index][1])
                    ))
                }
                {(props.editStatus && itemClassName === "expanded-table-item") && 
                    <div className='edit'>
                        <div className='edit-suggestion'>
                            <button onClick={() => props.automaticallyRegenerate(props.title)}>Regenerate</button>
                            <h3><img src="./images/loadingIcon.png" alt = "icon"/>AI powered</h3>
                        </div>
                        <div className='edit-prompt'>
                            <img src="./images/loadingIcon.png" alt = "icon"/>
                            <input type='text' id={`prompt${props.index}`} placeholder='Ask AI to write anything' onKeyPress={handleKeypress} />
                            <button onClick={sendPrompt} >Send</button>
                        </div>
                    </div>
                }
            </div>
            <button onClick={expandCollapseBtn}>
                {itemClassName === "minimised-table-item" ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
            </button>
        </div>
    );
};

const expandSubItem = (index1, index2, title, data) => {
    return(
        <div key = {index2} className='expanded-table-subitem'>
            <h2>{``}</h2>
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
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;
    return(
        <div>
            {data.map((data, index) => (
                <div className='expanded-table-sub-subitem'>
                    <h1>{`1.${index+1}.`}</h1>
                    {/* <h1 style={{minWidth: "1px", margin: 0}}>:</h1> */}
                    {pattern.test(data) ? (
                        <h3>{data.substring(data.indexOf('.') + 2)}</h3>
                    ) : (
                        pattern2.test(data) ? (
                            <h3>{data.substring(2)}</h3>
                        ) :
                            <h3>{data}</h3>
                    )}
                </div>
            ))}
        </div>
    );
};
