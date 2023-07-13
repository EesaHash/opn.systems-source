import React, { useState } from 'react';
import "../../style/table.css";
import { AccessTime, Chat, Download, Edit, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { ListItem } from './ListItem';

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
        <div className='fifth-table' id = {props.id}>
            <div className='fifth-table-content'>
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
                <h1>{props.sub_title}</h1>
                <div className='fifth-table-desc'>
                    <hr/>
                    {props.desc}
                    <hr/>
                </div>
                <ListItem 
                    listTitle = {props.list1Title}
                    list = {props.list1}
                />
                <ListItem 
                    listTitle = {props.list2Title}
                    list = {props.list2}
                />
                <ListItem 
                    listTitle = {props.list3Title}
                    list = {props.list3}
                />
            </div>
        </div>
    );
};
export const FifthTableDescAsList = (icon, title, data) => {
    const temp = data ? data.split("\n") : [];
    const pattern = /^\d+\.\s+/;
    const pattern2 = /^[-•]\s+/;
    return(
        <div className='fifth-table-desc-item'>
            <h2>{icon}{title}</h2>
            <div className='desc-item-list'>
                {temp.map((res, index) => (
                    (res.length > 0) && (
                        pattern.test(res) ? (
                            <div key={index} className='desc-item-list-item'>
                                <h3>{index + 1}.</h3>
                                <text>{res.substring(res.indexOf('.') + 2)}</text>
                            </div> 
                            ) : (
                            pattern2.test(res) ? (
                                <div key={index} className='desc-item-list-item'>
                                    <h3>-</h3>
                                    <text>{res.substring(2)}</text>
                                </div> 
                            ) : (
                                <div key={index} className='desc-item-list-item'>
                                    <h3>-</h3>
                                    <text>{res}</text>
                                </div>
                            )
                        )
                    )
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

// const listItem = (list, listTitle) => {
//     const pattern = /^\d+\.\s+/;
//     const pattern2 = /^[-•]\s+/;
//     return(
//         <div className='fifth-table-list'>
//             <h2>{listTitle}</h2>
//             {list.map((data, index) => (
//                 (data.length > 0) && (
//                     pattern.test(data) ? (
//                         <div key={index} className='fifth-table-list-item'>
//                             <h3>{index + 1}</h3>
//                             <text>{data.substring(data.indexOf('.') + 2)}</text>
//                         </div>
//                     ) : (
//                         pattern2.test(data) ? (
//                             <div key={index} className='fifth-table-list-item'>
//                                 <h3>-</h3>
//                                 <text>{data.substring(2)}</text>
//                             </div>
//                         ) : (
//                             <div key={index} className='fifth-table-list-item'>
//                                 <h3>-</h3>
//                                 <text>{data}</text>
//                             </div>
//                         )
//                     )
//                 )
//             ))}
//         </div>
//     );
// };