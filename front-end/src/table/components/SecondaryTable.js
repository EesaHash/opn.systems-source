import React, { useState } from 'react';
import "../style/table.css";
import { AccessTime, Chat, Download, Edit, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { ExpandMinimisedTableItem } from './ExpandMinimisedTableItem';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

export const SecondaryTable = (props) => {
    const [editStatus, setEditStatus] = useState(false);
    const mainDirectory = _ => {
        return(
            <div className='table-directory-right-header'>
                <button onClick={openAccessLimitForm} ><Share/></button>
                <button onClick={openAccessLimitForm} ><Download/></button>
                <button onClick={openAccessLimitForm} ><Chat/></button>
                <button onClick={openAccessLimitForm} ><AccessTime/></button>
                <button onClick={openFutureFeatureWarningForm} ><MoreHoriz/></button>
                <hr/>
                <button className='edit-btn' onClick={() => setEditStatus(true)} ><Edit/>Edit</button>
            </div>
        );
    };
    const saveUpdate = _ => {
        setEditStatus(false);
    };
    const editDirectory = _ => {
        return(
            <div className='table-directory-right-header'>
                <button className='ai-edit-btn'><img src="./images/ai_icon.png" alt = "icon"/>AI Editing Mode</button>
                <hr/>
                <button className='save-btn' onClick={saveUpdate}><SimCardDownload/>Save</button>
            </div>
        );
    };
    const closeEditMode = _ => {
        setEditStatus(false);
    };
    return(
        <div className='secondary-table' id = {props.id}>
            <div className='secondary-table-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={props.button1}>{`${props.type}`}</button>
                        <h3>/</h3>
                        <button onClick={closeEditMode}>{`${props.title}`}</button>
                        {editStatus && <h3>/</h3>}
                        {editStatus && <button>Editing<Edit/></button>}
                    </div>
                    {editStatus ? editDirectory() : mainDirectory()}
                </div>
                <h1>{props.title}</h1>
                <h2>{props.description}</h2>
                <div className='secondary-table-items'>
                    <div className='items-title'>
                        <h1>Steps List</h1>
                        {/* <button >Expand all<KeyboardArrowDown/></button> */}
                    </div>
                    {props.data && 
                        Object.keys(props.data).map((data, index) => (
                            (!("id overview productID createdAt updatedAt title").includes(data)) &&
                                <ExpandMinimisedTableItem
                                    index = {index - 2}
                                    title = {props.dataHeading[index - 3]}
                                    data = {JSON.parse(Object.entries(props.data)[index][1])}
                                    editStatus = {editStatus}
                                    automaticallyRegenerate = {props.automaticallyRegenerate}
                                    regenerateByPrompt = {props.regenerateByPrompt}
                                />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};
