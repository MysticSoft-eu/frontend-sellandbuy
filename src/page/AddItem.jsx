// Importing required modules and components
import React, { useState, useContext } from 'react';
import axios from 'axios';
import RecursiveCategorySelector from '../components/CategorySelector.jsx';
// It seems this import is not used in the component
// import PhotosUploader from '../PhotosUploader'; 
import "../styles/AddItem.css"
import { UserContext } from "../UserContext";
import Test from './test.jsx'; 

export default function AddItem() {
    // Extracting user from the UserContext
    const { user } = useContext(UserContext);
    
    // Initializing the state for the item using useState hook
    const [item, setItem] = useState({
        title: "",
        address: "",
        description: "",
        price: 0,
        category: "",
        subcategory: "",
        photos: [],
        login: user ? user.name : "", // Initializing login with user name if user exists
    });

    // Handle the form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        try {
            // Send a post request to '/additem' endpoint with item as the payload
            const response = await axios.post('/additem', item);
            console.log(response.data); // Log the response from the server
        } catch (error) {
            console.error(error); // Log any errors that occur during the post request
        }
    };

    // Handle changes to the input fields
    const handleChange = (event) => {
        // Update the corresponding property in the item state
        setItem({ ...item, [event.target.name]: event.target.value, login: user.name });
    };

    // Handle changes to the category
    const handleCategoryChange = (categories) => {
        setItem({ ...item, category: categories });
    };
    
    // Handle changes to the subcategory
    const handleSubCategoryChange = (subcategory) => {
        setItem({ ...item, subcategory: subcategory });
    };

    // Handle changes to the photos
    const handlePhotosChange = (photos) => {
        setItem({ ...item, photos });
    };

    // Render the component
    return (
        <div>
            <form onSubmit={handleSubmit}> 
                <h1>Add Item</h1>
                {/* Input field for the title */}
                <label>
                    Title:
                    <input 
                        maxLength={100}
                        type="text" 
                        name="title" 
                        value={item.title} 
                        onChange={handleChange} 
                    />
                </label>
                {/* Input field for the address */}
                <label>
                    Address:
                    <input 
                        maxLength={100}
                        type="text" 
                        name="address" 
                        value={item.address} 
                        onChange={handleChange} 
                    />
                </label>
                {/* Input field for the description */}
                <label>
                    Description:
                    <input 
                        maxLength={1000}
                        type="text" 
                        name="description" 
                        value={item.description} 
                        onChange={handleChange} 
                    />
                </label>
                {/* Component to upload photos */}
                <div>
                    Photos:
                    <Test onChange={handlePhotosChange} />
                </div>
                {/* Dropdown for the category */}
                <label>
                    Category:
                    <RecursiveCategorySelector onCategoryChange={handleCategoryChange} />
                </label>
                {/* Input field for the price */}
                <label>
                    Price:
                    <input 
                        maxLength={100}
                        type="number" 
                        name="price" 
                        value={item.price} 
                        onChange={handleChange} 
                    />
                </label>
                {/* Submit button to submit the form */}
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
}
