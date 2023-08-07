import React, { useState } from 'react';
import "../../style/table.css";
import { AccessTime, ArrowBack, Chat, Download, Edit, KeyboardArrowDown, KeyboardArrowUp, MoreHoriz, Share, SimCardDownload } from '@mui/icons-material';
import { ExpandMinimisedTableItem } from '../ExpandMinimisedItem/ExpandMinimisedTableItem';
import { openAccessLimitForm, openFutureFeatureWarningForm } from '../../../dashboard/page/dashboard_main';
import { EditPopUp } from '../EditPopUp';
import { LoadingTableItem } from '../LoadingTableItem';

/**
 * Component to display a secondary list table.
 * @param {Object} props - Component props
 * @param {string} props.id - ID for the secondary list table
 * @param {string} props.title - Title for the secondary list table
 * @param {string} props.type - Type for the secondary list table
 * @param {string} props.description - Description for the secondary list table
 * @param {Object} props.data - Data for the secondary list table
 * @param {Array} props.dataHeading - Data headings for the secondary list table
 * @param {function} props.button1 - Function for button 1
 * @param {function} props.saveBtn - Function to save the changes
 * @param {function} props.automaticallyRegenerate - Function for automatic regeneration
 * @param {function} props.regenerateByPrompt - Function for regeneration by prompt
 * @param {function} props.automaticallyRegenerateForStep - Function for automatic regeneration of steps
 * @param {function} props.regenerateByPromptForStep - Function for regeneration by prompt of steps
 * @param {boolean} props.loading - Loading status
 * @param {string} props.loadingTitle - Loading title
 * @returns {JSX.Element} - JSX element for ListTable2
 */
export const ListTable2 = (props) => {
    const [loading, setLoading] = useState(false);
    const [editStatus, setEditStatus] = useState(false);
    const [isAIEditOver, setIsAIEditOver] = useState(false);
    const [expandAll, setExpandAll] = useState(false);
    const [selectedStage, setSelectedStage] = useState(0);

    const mainDirectory = _ => {
        return (
            <div className='table-directory-right-header'>
                <button onClick={openAccessLimitForm}><Share /></button>
                <button onClick={openAccessLimitForm}><Download /></button>
                <button onClick={openAccessLimitForm}><Chat /></button>
                <button onClick={openAccessLimitForm}><AccessTime /></button>
                <button onClick={openFutureFeatureWarningForm}><MoreHoriz /></button>
                <hr />
                <button className='edit-btn' onClick={() => setEditStatus(true)}><Edit />Edit</button>
            </div>
        );
    };
    const saveUpdate = _ => {
        props.saveBtn();
        closeEditMode();
    };
    const editDirectory = _ => {
        return (
            <div className='table-directory-right-header'>
                <button className={`ai-edit-btn${isAIEditOver ? " active" : ""}`} onClick={() => setIsAIEditOver(!isAIEditOver)}>
                    <img src="./images/ai_icon.png" alt="icon" /> AI Editing Mode {isAIEditOver ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </button>
                <hr />
                <button className='save-btn' onClick={saveUpdate}><SimCardDownload />Save</button>
            </div>
        );
    };
    const closeEditMode = _ => {
        setIsAIEditOver(false);
        setEditStatus(false);
    };
    const isEditSelected = (index) => {
        return (editStatus && index === selectedStage);
    };
    return (
        <div className='secondary-table' id={props.id}>
            {loading ? (
                <LoadingTableItem title={props.loadingTitle} documentName={props.title} />
            ) : (
                <div className='secondary-table-content'>
                    <div className='table-directory'>
                        <div className='table-directory-left-header'>
                            <button onClick={editStatus ? closeEditMode : props.button1}><ArrowBack /></button>
                            <button onClick={props.button1}>{`${props.type}`}</button>
                            <h3>/</h3>
                            <button onClick={closeEditMode}>{`${props.title}`}</button>
                            {editStatus && <h3>/</h3>}
                            {editStatus && <button>Editing<Edit /></button>}
                        </div>
                        {editStatus ? editDirectory() : mainDirectory()}
                    </div>
                    {isAIEditOver &&
                        <EditPopUp
                            automaticallyRegenerate={props.automaticallyRegenerate}
                            regenerateByPrompt={props.regenerateByPrompt}
                            setLoading={setLoading}
                        />
                    }
                    <h1>{props.title}</h1>
                    <h2>{props.description}</h2>
                    <div className='secondary-table-items'>
                        <div className='items-title'>
                            <h1>Steps List</h1>
                            <button onClick={() => setExpandAll(!expandAll)}>
                                {expandAll ? "Minimised all" : "Expand all"}
                                {expandAll ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </button>
                        </div>
                        {props.data &&
                            Object.keys(props.data).map((data, index) => (
                                (!("id overview productID createdAt updatedAt title stages").includes(data)) &&
                                <ExpandMinimisedTableItem
                                    index={index - 2}
                                    loadingTitle={props.loadingTitle}
                                    loadingDocName={`${props.title}'s ${props.dataHeading[index - 3]} ${props.type}`}
                                    title={props.dataHeading[index - 3]}
                                    data={JSON.parse(Object.entries(props.data)[index][1])}
                                    editStatus={editStatus}
                                    automaticallyRegenerate={props.automaticallyRegenerateForStep}
                                    regenerateByPrompt={props.regenerateByPromptForStep}
                                    loading={props.loading}
                                    itemClassName={expandAll ? "expanded-table-item" : "minimised-table-item"}
                                    setSelectedItem={setSelectedStage}
                                    isEditSelected={isEditSelected}
                                />
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};
