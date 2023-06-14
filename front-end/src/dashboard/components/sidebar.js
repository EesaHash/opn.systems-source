import React, { useState } from "react";
import "../style/sidebar.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className="content">
    <div className="d-flex align-items-start">
    <div className="sidebar">
      <CDBSidebar textColor="#fff" backgroundColor="#000000">
        <CDBSidebarHeader className="sidebar-header" prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none">
            Opn.Systems
          </a>
        </CDBSidebarHeader>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem className="menu-item-tab" icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/businessPage" activeClassName="activeClicked">
              <CDBSidebarMenuItem className="menu-item-tab" icon="table" iconType="solid" >Business</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
        <CDBSidebarFooter className="sidebar-footer">
          <div>
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
    </div>
    </div>
  );
};