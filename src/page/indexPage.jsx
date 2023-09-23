import React from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Category from "../components/Category";
import AddNotice from "../components/AddNotice";
import LatestListings from "../components/LatestListings";
import "../App.css";

function Layout() {
  return (
    <div className="App">
      {/* The main structure of the application */}
      <div className="main-content">
        
        {/* Searchbar component for searching */}
        <Searchbar />
        
        {/* Category component for displaying categories */}
        <Category />
        
        {/* AddNotice component for adding new notices */}
        <AddNotice />
        
        {/* LatestListings component for displaying the latest listings */}
        <LatestListings />
      </div>
    </div>
  );
}

export default Layout;
