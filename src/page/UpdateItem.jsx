import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CategoryManager.css';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Test from './test.jsx';

export default function UpdateItem() {
  // Get the user context
  const { user } = useContext(UserContext);
  
  // Get the item ID from the URL params
  const { id } = useParams();
  
  // State to store item details, categories, and selected categories
  const [item, setItem] = useState({
    title: "",
    address: "",
    description: "",
    price: 0,
    category: [],
    photos: [],
    login: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch item and category data based on the item ID
  useEffect(() => {
    if (!id) { return; }
    axios.get('/items/' + id)
      .then(response => {
        console.log('Item data:', response.data);
        setItem(response.data);
        setSelectedCategories(response.data.category); // assuming category is an array of names
      });

    axios.get('/categories')
      .then(response => {
        console.log('Categories:', response.data);
        setCategories(response.data);
      });
  }, [id]);

  // Handle form submission to update the item
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('/items/' + id, item);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle photo changes using the Test component
  const handlePhotosChange = (photos) => {
    setItem({ ...item, photos });
  };

  // Handle category selection changes
  const handleChange = (index, event) => {
    const newSelectedCategories = selectedCategories.slice(0, index + 1);
    newSelectedCategories[index] = event.target.value;
    setSelectedCategories(newSelectedCategories);
    setItem({ ...item, category: newSelectedCategories });
  };

  // Render category selection dropdowns
  const renderSelect = (index) => (
    <div className="category-container">
      <select
        className="custom-select"
        name="category"
        value={selectedCategories[index] || ''}
        onChange={(event) => handleChange(index, event)}
      >
        <option value="">Select category</option>
        {getOptions(index).map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );

  // Get category options based on the selected category hierarchy
  const getOptions = (index) => {
    const parent = index > 0 ? selectedCategories[index - 1] : null;
    return categories.filter((category) => category.parent === parent);
  };

  // Determine the number of category selection dropdowns
  const getNumberOfSelects = () => {
    for (let i = 0; i < selectedCategories.length; i++) {
      const options = getOptions(i + 1);
      if (options.length === 0) {
        return i + 1;
      }
    }
    return selectedCategories.length + 1;
  };

  const numberOfSelects = getNumberOfSelects();

  return (
    <div>
      <h1>Update Item</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for item details */}
        {/* ... */}
        <label>
          Photos:
          {/* Use the Test component for photo upload */}
          <Test onChange={handlePhotosChange} initialPhotos={item.photos} />
        </label>
        {/* ... */}
        <label>
          {/* Render category selection dropdowns */}
          <div className="category-container">
            {Array.from({ length: numberOfSelects }, (_, index) =>
              renderSelect(index)
            )}
          </div>
        </label>
        {/* ... */}
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
}
