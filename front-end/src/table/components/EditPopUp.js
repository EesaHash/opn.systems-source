import React, { useState } from 'react';
import "../style/table.css";
import { ArrowForwardIos } from '@mui/icons-material';

export const EditPopUp = (props) => {
    const [selectedMenu, setSelectedMenu] = useState("");
    return(
        <div className='edit-pop-up'>
            {selectedMenu === "command" && inputPrompt()}
            <div className='edit-pop-up-content'>
                <div className={`pop-up-item${selectedMenu === "command" ? " active" : ""}`} onClick={() => setSelectedMenu("command")}>
                    <img src="./images/EditIcon/commandIcon.png" alt="icon"/>
                    <div className='pop-up-item-title'>
                        <button>Commands</button>
                        <text>Tell our AI exactly what to do</text>
                    </div>
                </div>
                <div className={`pop-up-item${selectedMenu === "regenerate" ? " active" : ""}`} onClick={() => setSelectedMenu("regenerate")}>
                    <img src="./images/EditIcon/refresh.png" alt="icon"/>
                    <div className='pop-up-item-title'>
                        <button>Regenerate File</button>
                        <text>Let AI regenerate your file</text>
                    </div>
                </div>
                <hr/>
                <div className={`help-btn${selectedMenu === "help" ? " active" : ""}`} onClick={() => setSelectedMenu("help")}>
                    <img src="./images/EditIcon/search-circle.png" alt="icon"/>
                    <button>Help</button>
                    <ArrowForwardIos/>
                </div>
            </div>
        </div>
    );
};
const inputPrompt = _ => {
    return(
        <div className='edit'>
            <div className='edit-prompt'>
                <img src="./images/loadingIcon.png" alt = "icon"/>
                <input type='text' id={`prompt`} placeholder='Ask AI to write anything' onKeyPress={null} />
                <button onClick={null} >Send</button>
            </div>
        </div>
    );
};