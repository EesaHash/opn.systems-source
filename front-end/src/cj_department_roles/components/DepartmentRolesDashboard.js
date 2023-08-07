import React from 'react';
import "../style/department_roles.css";
import { ListTable } from '../../table/components/List/ListTable';
import { openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

/**
 * DepartmentRolesDashboard functional component.
 * This component renders a dashboard for managing departments and roles.
 *
 * @param {Object} props - The props object for the component (unused in this implementation).
 * @returns {JSX.Element} - The DepartmentRolesDashboard component's UI.
 */
export const DepartmentRolesDashboard = (props) => {

    return (
        // Main container for the department roles dashboard.
        <div className='department-roles'>
            {/* 
                ListTable component renders a table with a title, a list of data, 
                an "Add New" button, and item action buttons (which are null in this case).
                
                @param {string} id - ID for the main table element.
                @param {string} title - Title displayed above the table.
                @param {Array} list - An empty array, as no data is provided in this implementation.
                @param {function} addNewBtn - Function to be called when the "Add New" button is clicked. 
                                             It opens a warning form for a future feature (not provided here).
                @param {null} itemActionBtn - Null, meaning no item action buttons are rendered.
            */}
            <ListTable
                id="department-roles-main-table"
                title="Department & Roles"
                list={[]}
                addNewBtn={openFutureFeatureWarningForm}
                itemActionBtn={null}
            />
        </div>
    );
};
