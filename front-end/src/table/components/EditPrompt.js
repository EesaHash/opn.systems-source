import React from 'react';
import "../style/table.css";

export const EditPrompt = _ => {
    return(
        <div className='edit'>
            <div className='edit-suggestion'>
                <button onClick={null}>Regenerate</button>
                <h3><img src="./images/loadingIcon.png" alt = "icon"/>AI powered</h3>
            </div>
            <div className='edit-prompt'>
                <img src="./images/loadingIcon.png" alt = "icon"/>
                <input type='text' id={`prompt`} placeholder='Ask AI to write anything' onKeyPress={null} />
                <button onClick={null} >Send</button>
            </div>
        </div>
    )
};