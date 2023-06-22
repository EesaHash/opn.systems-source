import React from "react";
import "../style/searchbar.css"
import SearchIcon from '@mui/icons-material/Search';

export const SearchBar = () => {
    return(
      <div className="search-bar">
      <div className="search-container">
      <SearchIcon className="search-icon" />
        <input
          type="text"
          id="searchInput"
          placeholder="Search for business, CCF, SOPs or keywords"
        />
      </div>
    </div>
    );
}
    