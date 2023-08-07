import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { LoadingTableItem } from '../LoadingTableItem';

/**
 * @param {Object} props - Component props
 * @param {string} props.itemClassName - Class name for the table item
 * @param {number} props.index - Index of the table item
 * @param {string} props.title - Title of the table item
 * @param {Object} props.data - Data to display for the table item
 * @param {function} props.isEditSelected - Function to check if the item is in edit mode
 * @param {function} props.automaticallyRegenerate - Function to trigger automatic regeneration
 * @param {function} props.regenerateByPrompt - Function to regenerate based on a given prompt
 * @param {function} props.setSelectedItem - Function to set the selected item
 */
export const ExpandMinimisedTableItem = (props) => {
    const [itemClassName, setItemClassName] = useState(props.itemClassName);
    const [loading, setLoading] = useState(false);

    // useEffect to update itemClassName when props.itemClassName changes
    useEffect(() => {
        setItemClassName(props.itemClassName);
    }, [props.itemClassName]);

    /**
     * Function to toggle between expanded and minimised view of the table item
     */
    const expandMinimisedBtn = () => {
        if (itemClassName === "minimised-table-item")
            setItemClassName("expanded-table-item");
        else
            setItemClassName("minimised-table-item");
    };

    /**
     * Function to trigger automatic regeneration for the table item
     */
    const regenerate = () => {
        props.automaticallyRegenerate(props.index - 1, setLoading);
    };

    /**
     * Function to send a prompt for table item regeneration
     */
    const sendPrompt = () => {
        const prompt = document.getElementById(`prompt${props.index}`).value;
        if (!prompt)
            return alert("Prompt cannot be empty!");
        props.regenerateByPrompt(props.index - 1, prompt, setLoading);
        document.getElementById(`prompt${props.index}`).value = "";
    };

    /**
     * Event handler for handling Enter keypress in the input field
     * Sends the prompt when Enter key is pressed
     * @param {object} e - The keypress event
     */
    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            sendPrompt();
        }
    };

    /**
     * Function to handle item click event
     * Expands the item if it's minimised and sets the selected item
     */
    const itemClicked = () => {
        if (itemClassName === "minimised-table-item")
            expandMinimisedBtn();
        props.setSelectedItem(props.index);
    };

    return (
        <div key={props.index} className={`${itemClassName}${props.isEditSelected(props.index) ? " active" : ""}`} onClick={itemClicked}>
            <h2>{props.index}</h2>
            <div style={{ width: "100%", display: "grid" }}>
                <div style={{ display: "grid" }} className={itemClassName === "expanded-table-item" && (props.isEditSelected(props.index) && !loading) ? "edit-selected" : ""}>
                    <h1 style={{ width: "100%", cursor: "pointer" }} onClick={() => itemClassName === "expanded-table-item" && expandMinimisedBtn()}>{props.title}</h1>
                    {(itemClassName === "expanded-table-item") && (
                        loading ? (
                            <LoadingTableItem title={props.loadingTitle} documentName={`${props.loadingDocName}`} />
                        ) : (
                            Object.keys(props.data).map((data, index) => (
                                expandSubItem(props.index, index, data, Object.entries(props.data)[index][1])
                            ))
                        )
                    )}
                </div>
                {(props.isEditSelected(props.index) && itemClassName === "expanded-table-item" && !loading) &&
                    <div className='edit'>
                        <div className='edit-suggestion'>
                            <button onClick={regenerate}>Regenerate</button>
                            <h3><img src="./images/loadingIcon.png" alt="icon" />AI powered</h3>
                        </div>
                        <div className='edit-prompt'>
                            <img src="./images/loadingIcon.png" alt="icon" />
                            <input type='text' id={`prompt${props.index}`} placeholder='Ask AI to write anything' onKeyPress={handleKeypress} />
                            <button onClick={sendPrompt} >Send</button>
                        </div>
                    </div>
                }
            </div>
            <button onClick={expandMinimisedBtn}>
                {itemClassName === "minimised-table-item" ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </button>
        </div>
    );
};

/**
 * Function to render a sub-item of the expanded table item
 * @param {number} index1 - The index of the parent table item
 * @param {number} index2 - The index of the sub-item
 * @param {string} title - The title of the sub-item
 * @param {any} data - The data to display for the sub-item
 * @returns {JSX.Element} - JSX element for the sub-item
 */
const expandSubItem = (index1, index2, title, data) => {
    return (
        <div key={index2} className='expanded-table-subitem'>
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

/**
 * Function to render a sub-item when the data is an array
 * @param {Array} data - The array data
 * @param {number} index1 - The index of the parent table item
 * @returns {JSX.Element} - JSX element for the sub-item
 */
const arraySubItem = (data, index1) => {
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;
    return (
        <div>
            {data.map((data, index) => (
                <div className='expanded-table-sub-subitem'>
                    <h1>{`${index1}.${index + 1}.`}</h1>
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
