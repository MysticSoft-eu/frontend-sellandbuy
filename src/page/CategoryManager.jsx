import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryManager() {
  // State variables to manage categories and form inputs
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');

  // Fetch categories from the backend when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://backendsellandbuy-516d9183eb68.herokuapp.com/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Function to add a new category
  const addCategory = async () => {
    try {
      await axios.post('https://backendsellandbuy-516d9183eb68.herokuapp.com/categories', {
        name: newCategoryName,
        parent: parentCategory || null,
      });
      // Clear form inputs and fetch updated categories
      setNewCategoryName('');
      setParentCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <div>
      <h1>Create a new category</h1>
      {/* Input field for category name */}
      <input
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="Category name"
      />
      {/* Dropdown for selecting parent category */}
      <select value={parentCategory} onChange={(e) => setParentCategory(e.target.value)}>
        <option value="">No parent</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {/* Button to add a new category */}
      <button onClick={addCategory}>Add Category</button>

      <h1>Categories</h1>
      <ul>
        {/* Display the list of categories */}
        {categories.map((category) => (
          <li key={category._id}>
            {category.name} {category.parent && `(Parent: ${category.parent})`}
            {/* Display children categories if they exist */}
            {category.children && category.children.length > 0 && (
              <div>
                <h3>Children:</h3>
                <ul>
                  {category.children.map((child) => (
                    <li key={child}>{child}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;
