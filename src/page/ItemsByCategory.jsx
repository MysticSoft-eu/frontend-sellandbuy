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
  const { category, searchQuery = "", cityQuery = "" } = useParams();
  const [listings, setListings] = useState([]);
  const [inputValue, setInputValue] = useState(searchQuery); 
  const [city, setCity] = useState(cityQuery); 
  const [selected, setSelected] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (selected && selected.length > 0){
      navigate(`/category/${selected.map(cat => cat.name).join(',')}${inputValue ? `/${inputValue}` : `/all`}${city ? `/${city}` : ''}`)
    }
    fetchItems();

    console.log(selected);
  }, [selected]);

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

  useEffect(() => {
    setInputValue(searchQuery);
    setCity(cityQuery);
    fetchItems();
  }, [category, searchQuery, cityQuery]);

  const handleInput = () => {
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, [ minPrice, maxPrice, sortOption]);

  return (
    <div className='bodyc'>
      <div className="search-container">
       

        <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)} 
            placeholder="Search..."
            className="search-input"
        />
        <Link to={`/category/${category}${inputValue ? `/${inputValue}` : `/all`}${city ? `/${city}` : ''}`}>
          <button onClick={handleInput} className="search-button">
            <FaSearch />
          </button>
        </Link>
        
        <>
        <input 
            type="text" 
            value={city}
            onChange={e => setCity(e.target.value)} 
            placeholder="City..."
            className="city-input"
        />
        <Link to={`/category/${category}${inputValue ? `/${inputValue}` : `/all`}${city ? `/${city}` : ''}`}>
          <button onClick={handleInput} className="search-button">
            <FaSearch />
          </button>
        </Link>
        </>
      </div>
      <div className="some-input">
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
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
            </select></div>
        </div>
      </div>

      <div className="listing-container">

          {listings.map((listing) => (     
             <Link to={`/itempage/${listing._id}`} key={listing._id}>
            <Listing listing={listing} key={listing._id} />
            </Link>
          ))}

       </div>
    </div>
  );
}
