import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { LoadingTableItem } from '../LoadingTableItem';

export const ExpandMinimisedTableItem = (props) => {
    const [itemClassName, setItemClassName] = useState(props.itemClassName);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setItemClassName(props.itemClassName)
    }, [props.itemClassName]);
    const expandMinimisedBtn = _ => {
        if(itemClassName === "minimised-table-item")
            setItemClassName("expanded-table-item");
        else
            setItemClassName("minimised-table-item");
    };
    const regenerate = _ => {
        props.automaticallyRegenerate(props.index-1, setLoading);
    };
    const sendPrompt = _ => {
        const prompt = document.getElementById(`prompt${props.index}`).value;
        if(!prompt)
            return alert("Prompt cannot be empty!");
        props.regenerateByPrompt(props.index - 1, prompt, setLoading);
        document.getElementById(`prompt${props.index}`).value = "";
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            sendPrompt();
        }
    };
    return(
        <div key = {props.index} className={itemClassName} onClick={() => itemClassName === "minimised-table-item" && expandMinimisedBtn()}>
            <h2>{props.index}</h2>
            <div style={{width:"100%", display: "grid"}}>
                <div style={{display: "grid"}} className={itemClassName === "expanded-table-item" && props.editStatus ? "edit-selected" : ""}>
                    <h1 style={{width: "100%", cursor: "pointer"}} onClick={() => itemClassName === "expanded-table-item" && expandMinimisedBtn()}>{props.title}</h1>
                    {(itemClassName === "expanded-table-item") && (
                        loading ? (
                            <LoadingTableItem title = {props.loadingTitle} documentName = {`${props.loadingDocName}`} /> 
                        ) : (
                            Object.keys(props.data).map((data, index) => (
                                expandSubItem(props.index, index, data, Object.entries(props.data)[index][1])
                            ))
                        )
                    )}
                </div>
                {(props.editStatus && itemClassName === "expanded-table-item" && !loading) && 
                    <div className='edit'>
                        <div className='edit-suggestion'>
                            <button onClick={regenerate}>Regenerate</button>
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
            <button onClick={expandMinimisedBtn}>
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
                    arraySubItem(data, index1) :
                    <h3>{data}</h3>
                }
            </div>
        </div>
    );
};
const arraySubItem = (data, index1) => {
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;
    return(
        <div>
            {data.map((data, index) => (
                <div className='expanded-table-sub-subitem'>
                    <h1>{`${index1}.${index+1}.`}</h1>
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
