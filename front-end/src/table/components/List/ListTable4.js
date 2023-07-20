import React, { useState } from 'react';
import "../../style/table.css";
import { AccessTime, Chat, Download, Edit, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { ListItem } from './ListItem';
import { dashPattern, letterPattern, numberingPattern, stepPattern } from '../PatternsItem';

export const ListTable4 = (props) => {
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
        <div className='list-table4' id = {props.id}>
            <div className='list-table4-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={props.button1}>{`${props.type}`}</button>
                        <h3>/</h3>
                        <button onClick={props.button2} >{`${props.title}`}</button>
                        <h3>/</h3>
                        <button onClick={props.button3} >{`${props.sub_title}`}</button>
                        <h3>/</h3>
                        <button onClick={closeEditMode}>{`${props.sub_title2}`}</button>
                        {editStatus && <h3>/</h3>}
                        {editStatus && <button>Editing<Edit/></button>}
                    </div>
                    {editStatus ? editDirectory() : mainDirectory()}
                </div>
                <h1>{props.sub_title2}</h1>
                <div className='list-table4-desc'>
                    <hr/>
                    {props.desc}
                    <hr/>
                </div>
                <ListItem 
                    listTitle = {props.list1Title}
                    list = {props.list1}
                    editStatus = {editStatus}
                    data = {props.desc}
                />
                <ListItem 
                    listTitle = {props.list2Title}
                    list = {props.list2}
                    editStatus = {editStatus}
                    data = {props.desc}
                />
                <ListItem 
                    listTitle = {props.list3Title}
                    list = {props.list3}
                    editStatus = {editStatus}
                    data = {props.desc}
                />
            </div>
        </div>
    );
};
export const FifthTableDescAsList = (icon, title, data) => {
    const temp = data ? JSON.parse(data) : [];
    return(
        <div className='list-table4-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='desc-item-list'>
                {temp.map((res, index) => (
                    (res.length > 0) && (
                        numberingPattern.test(res) ? (
                            numberingItem(index, res)
                            ) : (
                                stepPattern.test(res) ? (
                                    stepItem(index, res)
                                ) : (
                                    letterPattern.test(res) ? (
                                        letterItem(index, res)
                                    ) : (
                                        dashItem(index, res)
                                    )
                                )
                        )
                    )
                ))}
            </div>
        </div>
    )
};
const numberingItem = (index, data) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{index + 1}.</h3>
            <text>{data.replace(numberingPattern, '')}</text>
        </div> 
    );
};
const dashItem = (index, data) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>-</h3>
            <text>{data.replace(dashPattern, '')}</text>
        </div> 
    );
};
const letterItem = (index, data) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{data.substring(0, data.indexOf('.'))}</h3>
            <text>{data.replace(letterPattern, '')}</text>
        </div> 
    );
};
const stepItem = (index, data) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{data.substring(0, data.indexOf(':'))}</h3>
            <text>{data.replace(stepPattern, '')}</text>
        </div> 
    );
};
export const FifthTableDescItem = (icon, title, data) => {
    return(
        <div className='list-table4-desc-item'>
            <h2>{icon}{title}</h2>
            <text>{data}</text>
        </div>
    )
};