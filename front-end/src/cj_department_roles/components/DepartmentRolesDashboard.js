import React from 'react';
import "../style/department_roles.css";
import { ListTable } from '../../table/components/List/ListTable';
import { openFutureFeatureWarningForm } from '../../dashboard/page/dashboard_main';

export const DepartmentRolesDashboard = (props) => {

    return(
        <div className = 'department-roles'>
            <ListTable
                id = "department-roles-main-table"
                title = "Department & Roles"
                list = {[]}
                addNewBtn = {openFutureFeatureWarningForm}
                itemActionBtn = {null}
            />
        </div>
    );
};