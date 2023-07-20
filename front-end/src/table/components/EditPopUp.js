import React, { useState } from 'react';
import "../style/table.css";
import { ArrowForwardIos } from '@mui/icons-material';

export const EditPopUp = (props) => {
    const [selectedMenu, setSelectedMenu] = useState("");
    const regenerate = _ => {
        setSelectedMenu("");
        props.automaticallyRegenerate(props.setLoading);
    };
    const sendPrompt = _ => {
        const prompt = document.getElementById("journey_prompt").value;
        if(!prompt)
            return alert("Prompt cannot be empty!");
        props.regenerateByPrompt(prompt, props.setLoading);
        document.getElementById("journey_prompt").value = "";
    };
    return(
        <div className='edit-pop-up'>
            {selectedMenu === "command" && inputPrompt(sendPrompt)}
            {selectedMenu === "help" && help(setSelectedMenu)}
            <div className='edit-pop-up-content'>
                <div className={`pop-up-item${selectedMenu === "command" ? " active" : ""}`} onClick={() => setSelectedMenu(`${selectedMenu === "command" ? "" : "command"}`)}>
                    <img src="./images/EditIcon/commandIcon.png" alt="icon"/>
                    <div className='pop-up-item-title'>
                        <button>Commands</button>
                        <text>Tell our AI exactly what to do</text>
                    </div>
                </div>
                <div className={`pop-up-item${selectedMenu === "regenerate" ? " active" : ""}`} onClick={regenerate}>
                    <img src="./images/EditIcon/refresh.png" alt="icon"/>
                    <div className='pop-up-item-title'>
                        <button>Regenerate File</button>
                        <text>Let AI regenerate your file</text>
                    </div>
                </div>
                <hr/>
                <div className={`help-btn${selectedMenu === "help" ? " active" : ""}`} onClick={() => setSelectedMenu(`${selectedMenu === "help" ? "" : "help"}`)}>
                    <img src="./images/EditIcon/search-circle.png" alt="icon"/>
                    <button>Help</button>
                    <ArrowForwardIos/>
                </div>
            </div>
        </div>
    );
};
const inputPrompt = (sendPrompt) => {
    const handleKeypress = e => {
        if(e.key === "Enter"){
            sendPrompt();
        }
    };
    return(
        <div className='edit'>
            <div className='edit-prompt'>
                <img src="./images/loadingIcon.png" alt = "icon"/>
                <input type='text' id="journey_prompt" placeholder='Ask AI to write anything' onKeyPress={handleKeypress} />
                <button onClick={sendPrompt} >Send</button>
            </div>
        </div>
    );
};
const help = (setSelectedMenu) => {
    const closeForm = _ => {
        setSelectedMenu("");
    };
    return(
        <div className='edit-help'>
            <div className='edit-help-title'>
                <h2><img src="./images/EditIcon/search-circle.png" alt="icon"/>Help</h2>
                <div className='close-button'>
                    <button onClick={closeForm}>X</button>
                </div>
            </div>
            <hr/>
            <h3>"How to edit this file?"</h3>
            <div className='edit-help-content'>
                <text>You can edit a section of the document, by clicking on the element or by selecting the text.</text><br/>
                <text>Then, you may either choose one of the available quick actions or hit ‘Space’ to utilize commands.</text>
            </div>
        </div>
    );
};