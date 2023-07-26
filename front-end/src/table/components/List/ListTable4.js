import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { AccessTime, ArrowBack, Chat, Download, Edit, FormatAlignLeft, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { ListItem } from './ListItem';
import { dashPattern, letterPattern, numberingPattern, stepPattern } from '../PatternsItem';
import { EditPopUp } from '../EditPopUp';

export const ListTable4 = (props) => {
    const [editStatus, setEditStatus] = useState(false);
    const [isAIEditOver, setIsAIEditOver] = useState(false);
    useEffect(() => {
        const setTextAreaHeight = (id) => {
            const textarea = document.querySelector(id);
            if(!textarea)
                return;
            textarea.addEventListener("keyup", e => {
                textarea.style.height = "100%";
                let scrollHeight = e.target.scrollHeight;
                textarea.style.height = `${scrollHeight}px`;
            });
            textarea.style.height = `${textarea.scrollHeight}px`;
        };
        setTextAreaHeight(".h1");
        setTextAreaHeight(".text");
    }, [props.data]);
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
    const updatePurpose = (newData) => {
        props.setData({...props.data, purpose: newData});
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
                <textarea className='table-input h1' type="text" value={props.data.title} onChange={(event) => props.setData({...props.data, title: event.target.value})} readOnly = {!editStatus} />
                {/* <div className='table-input h1' type="text" onInput={(event) => props.setData({...props.data, title: event.target.textContent})} contentEditable = {editStatus} >{props.data.title}</div> */}
                <div className='list-table4-desc'>
                    <hr/>
                    {FifthTableDescItem(<FormatAlignLeft/>, "Objective", props.data.purpose, updatePurpose, editStatus)}
                    {FifthTableDescAsList(<FormatAlignLeft/>, "Definitions", props.data.definitions, editStatus)}
                    <hr/>
                </div>
                <ListItem 
                    listTitle = {props.list1Title}
                    list = {props.list1}
                    updateList = {props.updateList1}
                    editStatus = {editStatus}
                    setEditStatus = {setEditStatus}
                    data = {props.desc}
                />
                <ListItem 
                    listTitle = {props.list2Title}
                    list = {props.list2}
                    updateList = {props.updateList2}
                    editStatus = {editStatus}
                    setEditStatus = {setEditStatus}
                    data = {props.desc}
                />
                <ListItem 
                    listTitle = {props.list3Title}
                    list = {props.list3}
                    updateList = {props.updateList3}
                    editStatus = {editStatus}
                    setEditStatus = {setEditStatus}
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
        </div> 
    );
};
const dashItem = (index, data, editStatus) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>-</h3>
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(dashPattern, '')}</div>
        </div> 
    );
};
const letterItem = (index, data, editStatus) => {
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{data.substring(0, data.indexOf('.'))}</h3>
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(letterPattern, '')}</div>
        </div> 
    );
};
const stepItem = (index, data, editStatus) => {
    const stepNumbers = data.match(/\bStep\s+(\d+)\b/g);
    const numbersOnly = stepNumbers.map(step => parseInt(step.match(/\d+/)[0]));
    return(
        <div key={index} className='desc-item-list-item'>
            <h3>{numbersOnly}</h3>
            {/* <textarea className='table-input text' type="text" value={data.replace(stepPattern, '')} onChange={(event) => setData(event.target.value)} readOnly = {!editStatus} /> */}
            <div className='table-input text' contentEditable = {editStatus}>{data.replace(stepPattern, '')}</div>
        </div> 
    );
};
const FifthTableDescItem = (icon, title, data, setData, editStatus) => {
    return(
        <div className='list-table4-desc-item'>
            <h2>{icon}{title}</h2>
            <textarea className='table-input text' type="text" value={data} onChange={(event) => setData(event.target.value)} readOnly = {!editStatus} />
        </div>
    );
};