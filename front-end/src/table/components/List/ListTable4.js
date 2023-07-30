import React, { useEffect, useState } from 'react';
import "../../style/table.css";
import { AccessTime, ArrowBack, Chat, Delete, Download, Edit, FormatAlignLeft, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { ListItem } from './ListItem';
import { dashPattern, letterPattern, numberingPattern, setTextAreaHeight, stepPattern, updateListItem } from '../PublicTableComponents';
import { EditPopUp } from '../EditPopUp';

export const ListTable4 = (props) => {
    const [editStatus, setEditStatus] = useState(false);
    const [isAIEditOver, setIsAIEditOver] = useState(false);
    useEffect(() => {
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
    const updateDefinition = (newData) => {
        props.setData({...props.data, definitions: newData});
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
                    {FifthTableDescAsList(<FormatAlignLeft/>, "Definitions", (props.data.definitions ? JSON.parse(props.data.definitions) : []), updateDefinition, editStatus)}
                    <hr/>
                </div>
                <ListItem 
                    listTitle = {props.list1Title}
                    list = {props.list1}
                    updateList = {props.updateList1}
                    editStatus = {editStatus}
                    setEditStatus = {setEditStatus}
                />
                <ListItem 
                    listTitle = {props.list2Title}
                    list = {props.list2}
                    updateList = {props.updateList2}
                    editStatus = {editStatus}
                    setEditStatus = {setEditStatus}
                />
                <ListItem 
                    listTitle = {props.list3Title}
                    list = {props.list3}
                    updateList = {props.updateList3}
                    editStatus = {editStatus}
                    setEditStatus = {setEditStatus}
                />
            </div>
        </div>
    );
};
const FifthTableDescAsList = (icon, title, data, setData, editStatus) => {
    const temp = [];
    const setHeading = (pattern, data) => {
        let hyphen = "-";
        switch (pattern) {
            case "number":
                hyphen = data.substring(0, data.indexOf('.'));
                data = data.replace(numberingPattern, '');
                break;
            case "step":
                const stepNumbers = data.match(/\bStep\s+(\d+)\b/g);
                const numbersOnly = stepNumbers.map(step => parseInt(step.match(/\d+/)[0]));
                hyphen = numbersOnly;
                data = data.replace(stepPattern, '');
                break;
            case "letter":
                hyphen =  `${data.substring(0, data.indexOf('.'))}.`;
                data = data.replace(letterPattern, '');
                break;
            default:
                data = data.replace(dashPattern, '');
                break;
        }
        temp.push({
            pattern,
            hyphen,
            data,
            item: []
        });
    };
    data.forEach((value, index, arr) => {
        arr[index] = value;
        const data = arr[index];
        // if(data.length > 0){
            if(numberingPattern.test(data)){
                setHeading("number", data);
            }else if(stepPattern.test(data)){
                setHeading("step", data);
            }else if(letterPattern.test(data)){
                setHeading("letter", data);
            }else if(dashPattern.test(data)){
                setHeading("dash", data);
            }else{
                setHeading("empty", data);
            }
        // }
    });
    const updateDataContent = (index, newValue) => {
        const temp2 = updateListItem(temp, index, newValue);
        const result = toString(temp2);
        setData(result);
    };
    const deleteItem = (index) => {
        const _list = [...temp];
        _list.splice(index, 1);
        setData(toString(_list));
    };
    const toString = (list) => {
        let result = "[";
        list.forEach((data, index) => {
            result += `"${(data.data)}"`;
            if(index !== list.length - 1)
                result += ",";
        });
        result += "]";
        return result;
    };
    return(
        <div className='list-table4-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='desc-item-list'>
                {temp.map((res, index) => (
                    <div key={index} className='desc-item-list-item'>
                        {index > 0 && <hr/>}
                        <div style={{display: "flex"}}>
                            <h3>{res.hyphen}</h3>
                            <textarea className='table-input text' type="text" value={res.data} onChange={(event) => updateDataContent(index, event.target.value)} readOnly = {!editStatus} />
                            { editStatus && <div className='edit-icon' onClick={() => deleteItem(index)}><Delete/></div> }
                        </div>
                    </div>
                ))}
            </div>
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