import React from 'react';
import "../style/table.css";

export const EditPrompt = (props) => {
    const regenerate = _ => {
        props.automaticallyRegenerate(null);
    };
    const sendPrompt = _ => {
        const prompt = document.getElementById(`prompt${props.index}`).value;
        if(!prompt)
            return alert("Prompt cannot be empty!");
            props.regenerateByPrompt(prompt, null);
        document.getElementById(`prompt${props.index}`).value = "";
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            sendPrompt();
        }
    };
    return(
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
    )
};