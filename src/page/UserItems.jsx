import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Listing from '../components/Listing';

export default function ItemsPage() {
  // State to store the list of user items
  const [listings, setListings] = useState([]);

  // Fetch user items when the component mounts
  useEffect(() => {
    axios.get('/user-items').then(({ data }) => {
      setListings(data);
    });
  }, []);

  // Function to delete an item by ID
  const deleteItem = (id) => {
    axios.delete(`/items/${id}`).then(() => {
      // Remove the item from the state
      setListings(listings.filter((listing) => listing._id !== id));
    });
  };

  return (
    <div>
      {/* Link to the "Add Item" page */}
      <Link to="/addItem">
        <button>Add item</button>
      </Link>
      <div>
        {/* Map through user items and display them */}
        {listings.map((listing) => (
          <React.Fragment key={listing._id}>
            {/* Button to delete the item */}
            <button onClick={() => deleteItem(listing._id)}>Delete</button>
            {/* Link to the item details page */}
            <Link to={'/uploader/' + listing._id}>
              <Listing listing={listing} />
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
