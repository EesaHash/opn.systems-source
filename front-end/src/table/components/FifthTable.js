import React, { useState } from 'react';
import "../style/table.css";
import { AccessTime, Chat, Download, Edit, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

export const FifthTable = (props) => {
    const [editStatus, setEditStatus] = useState(false);
    const saveBtn = _ => {
        closeEditMode();
    };
    const closeEditMode = _ => {
        setEditStatus(false);
    };
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
    const editDirectory = _ => {
        return(
            <div className='table-directory-right-header'>
                <button className='ai-edit-btn'><img src="./images/ai_icon.png" alt = "icon"/>AI Editing Mode</button>
                <hr/>
                <button className='save-btn' onClick={saveBtn}><SimCardDownload/>Save</button>
            </div>
        );
    };
    return(
        <div className='fifth-table' id = {props.id}>
            <div className='fifth-table-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={props.button1}>{`${props.type}`}</button>
                        <h3>/</h3>
                        <button onClick={props.button2} >{`${props.title}`}</button>
                        <h3>/</h3>
                        <button onClick={closeEditMode}>{`${props.sub_title}`}</button>
                        {editStatus && <h3>/</h3>}
                        {editStatus && <button>Editing<Edit/></button>}
                    </div>
                    {editStatus ? editDirectory() : mainDirectory()}
                </div>
                <h1>{props.sub_title}</h1>
                <div className='fifth-table-desc'>
                    <hr/>
                    {props.desc}
                    <hr/>
                </div>
                <div className='fifth-table-list'>
                    <h2>{props.list1Title}</h2>
                    {props.list1.map((data, index) => (
                        listItem(index, data)
                    ))}
                </div>
            </div>
        </div>
    );
};
export const FifthTableDescAsNumberList = (icon, title, data) => {
    const temp = data ? data.split("\n") : [];
    return(
        <div className='fifth-table-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='desc-item-list'>
                {temp.map((res, index) => (
                    <div key={index} className='desc-item-list-item'>
                        <h3>{index + 1}.</h3>
                        <text>{res.substring(res.indexOf('.') + 2)}</text>
                    </div>
                ))}
            </div>
        </div>
    )
};
export const FifthTableDescAsList = (icon, title, data) => {
    const temp = data ? data.split("\n") : [];
    return(
        <div className='fifth-table-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='desc-item-list'>
                {temp.map((res, index) => (
                    <div key={index} className='desc-item-list-item'>
                        <h3>-</h3>
                        <text>{res.substring(2)}</text>
                    </div>
                ))}
            </div>
        </div>
    )
};
export const FifthTableDescItem = (icon, title, data) => {
    return(
        <div className='fifth-table-desc-item'>
            <h2>{icon}{title}</h2>
            <text>{data}</text>
        </div>
    )
};
const listItem = (index, data) => {
    return(
        <div key={index} className='fifth-table-list-item'>
            <h3>{index + 1}</h3>
            <text>{data.substring(data.indexOf('.') + 2)}</text>
        </div>
    );
};