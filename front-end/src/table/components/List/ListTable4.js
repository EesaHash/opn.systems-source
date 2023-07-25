import React, { useState } from 'react';
import "../../style/table.css";
import { AccessTime, ArrowBack, Chat, Download, Edit, FormatAlignLeft, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { ListItem } from './ListItem';
import { dashPattern, letterPattern, numberingPattern, stepPattern } from '../PatternsItem';
import { EditPopUp } from '../EditPopUp';

export const ListTable4 = (props) => {
    const [editStatus, setEditStatus] = useState(false);
    const [isAIEditOver, setIsAIEditOver] = useState(false);
    const saveUpdate = _ => {
        props.saveBtn();
        closeEditMode();
    };
    const closeEditMode = _ => {
        setIsAIEditOver(false);
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
                <button className={`ai-edit-btn${isAIEditOver ? " active" : ""}`} onClick={() => setIsAIEditOver(!isAIEditOver)}>
                    <img src="./images/ai_icon.png" alt = "icon"/> AI Editing Mode {isAIEditOver ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                </button>
                <hr/>
                <button className='save-btn' onClick={saveUpdate}><SimCardDownload/>Save</button>
            </div>
        );
    };
    return(
        <div className='list-table4' id = {props.id}>
            <div className='list-table4-content'>
                <div className='table-directory'>
                    <div className='table-directory-left-header'>
                        <button onClick={editStatus ? closeEditMode : props.button3}><ArrowBack/></button>
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
                {isAIEditOver && 
                    <EditPopUp
                        automaticallyRegenerate = {props.automaticallyRegenerate} 
                        regenerateByPrompt = {props.regenerateByPrompt} 
                        setLoading = {null} 
                    />
                }
                <div className='table-input h1' contentEditable = {editStatus}>{props.sub_title2}</div>
                <div className='list-table4-desc'>
                    <hr/>
                    {FifthTableDescItem(<FormatAlignLeft/>, "Objective", props.data.purpose, editStatus)}
                    {FifthTableDescAsList(<FormatAlignLeft/>, "Definitions", props.data.definitions, editStatus)}
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
const FifthTableDescAsList = (icon, title, data, editStatus) => {
    const temp = data ? JSON.parse(data) : [];
    return(
        <div className='list-table4-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='desc-item-list'>
                {temp.map((res, index) => (
                    (res.length > 0) && (
                        numberingPattern.test(res) ? (
                            numberingItem(index, res, editStatus)
                            ) : (
                                stepPattern.test(res) ? (
                                    stepItem(index, res, editStatus)
                                ) : (
                                    letterPattern.test(res) ? (
                                        letterItem(index, res, editStatus)
                                    ) : (
                                        dashItem(index, res, editStatus)
                                    )
                                )
                        )
                    )
                ))}
            </div>
        </div>
    )
};
const numberingItem = (index, data, editStatus) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{index + 1}.</h3>
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(numberingPattern, '')}</div>
            {/* <text>{data.replace(numberingPattern, '')}</text> */}
        </div> 
    );
};
const dashItem = (index, data, editStatus) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>-</h3>
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(dashPattern, '')}</div>
            {/* <text>{data.replace(dashPattern, '')}</text> */}
        </div> 
    );
};
const letterItem = (index, data, editStatus) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{data.substring(0, data.indexOf('.'))}</h3>
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(letterPattern, '')}</div>
            {/* <text>{data.replace(letterPattern, '')}</text> */}
        </div> 
    );
};
const stepItem = (index, data, editStatus) => {
    const stepNumbers = data.match(/\bStep\s+(\d+)\b/g);
    const numbersOnly = stepNumbers.map(step => parseInt(step.match(/\d+/)[0]));
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{numbersOnly}</h3>
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(stepPattern, '')}</div>
            {/* <text>{data.replace(stepPattern, '')}</text> */}
        </div> 
    );
};
const FifthTableDescItem = (icon, title, data, editStatus) => {
    return(
        <div className='list-table4-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='table-input text' contentEditable = {editStatus}>{data}</div>
            {/* <text>{data}</text> */}
        </div>
    )
};