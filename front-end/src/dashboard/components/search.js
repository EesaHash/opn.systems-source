import React from "react";
import "../style/searchbar.css"
import SearchIcon from '@mui/icons-material/Search';

/**
 * Component for rendering a search bar with a search input field.
 * Allows users to search for businesses, CCF, SOPs, or keywords.
 */
export const SearchBar = () => {
    return (
        <div className="search-bar">
            {/* Search container */}
            <div className="search-container">
                {/* Search icon */}
                <SearchIcon className="search-icon" />
                {/* Input field for search */}
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search for business, CCF, SOPs or keywords"
                />
            </div>
        </div>
    );
}
