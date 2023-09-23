import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/ItemsByCategory.css";
import { Link } from "react-router-dom";
import CategoryDropdown from '../components/CategoryTree'
import { FaSearch } from "react-icons/fa";
import Listing from '../components/Listing';

export default function ItemsByCategory() {
  // Get category, searchQuery, and cityQuery from URL parameters
  const { category, searchQuery = "", cityQuery = "" } = useParams();

  // State to store listings, input values, selected categories, price range, and sort option
  const [listings, setListings] = useState([]);
  const [inputValue, setInputValue] = useState(searchQuery); 
  const [city, setCity] = useState(cityQuery); 
  const [selected, setSelected] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();

  // Fetch items based on selected criteria when selected categories change
  useEffect(() => {
    if (selected && selected.length > 0){
      navigate(`/category/${selected.map(cat => cat.name).join(',')}${inputValue ? `/${inputValue}` : `/all`}${city ? `/${city}` : ''}`)
    }
    fetchItems();
  }, [selected]);

  // Function to fetch items based on selected criteria
  const fetchItems = async () => {
    let baseUrl = `/items`;
    let params = [];

    if (category) {
        params.push(`category=${category}`);
    }

    if (inputValue) {
        params.push(`search=${inputValue}`);
    }

    if (city) {
        params.push(`city=${city}`);
    }

    if (minPrice > 0) {
        params.push(`minPrice=${minPrice}`);
    }
    if (maxPrice < 100000000) {
        params.push(`maxPrice=${maxPrice}`);
    }

    if (sortOption) {
        params.push(`sortPrice=${sortOption}`);
    }

    if (params.length > 0) {
        baseUrl += "?" + params.join('&');
    }

    try {
        const response = await axios.get(baseUrl);
        setListings(response.data);
    } catch (error) {
        console.error("Failed to fetch items:", error);
    }
  };

  // Set input values and fetch items when category, search query, or city query change
  useEffect(() => {
    setInputValue(searchQuery);
    setCity(cityQuery);
    fetchItems();
  }, [category, searchQuery, cityQuery]);

  // Fetch items when price range or sorting option change
  useEffect(() => {
    fetchItems();
  }, [minPrice, maxPrice, sortOption]);

  return (
    <div className='bodyc'>
      <div className="search-container">
        {/* Input field for search query */}
        <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)} 
            placeholder="Search..."
            className="search-input"
        />
        {/* Button to trigger search */}
        <Link to={`/category/${category}${inputValue ? `/${inputValue}` : `/all`}${city ? `/${city}` : ''}`}>
          <button onClick={handleInput} className="search-button">
            <FaSearch />
          </button>
        </Link>
        
        {/* Input field for city query */}
        <>
        <input 
            type="text" 
            value={city}
            onChange={e => setCity(e.target.value)} 
            placeholder="City..."
            className="city-input"
        />
        {/* Button to trigger city search */}
        <Link to={`/category/${category}${inputValue ? `/${inputValue}` : `/all`}${city ? `/${city}` : ''}`}>
          <button onClick={handleInput} className="search-button">
            <FaSearch />
          </button>
        </Link>
        </>
      </div>
      <div className="some-input">
        {/* Category dropdown for selecting categories */}
        <CategoryDropdown className="category-input" setSelectedCategories={setSelected} selectedCategories={selected} />
        <div className="price-input">
          <div class="item">
            <label>Min Price:</label>
            <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
            /></div>
            <div class="item">
            <label>Max Price:</label>
            <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
            /></div>
            <div class="item">
            <label>Sort By:</label>
            {/* Dropdown for sorting options */}
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
            </select></div>
        </div>
      </div>

      <div className="listing-container">
        {/* Display listings */}
        {listings.map((listing) => (     
             <Link to={`/itempage/${listing._id}`} key={listing._id}>
              <Listing listing={listing} key={listing._id} />
             </Link>
          ))}
       </div>
    </div>
  );
}
