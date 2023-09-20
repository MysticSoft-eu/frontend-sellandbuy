import axios from 'axios';
import React, { useEffect , useState } from 'react';
import { Link } from "react-router-dom"

import Listing from '../components/Listing';

export default function ItemsPage() {
  const [listings, setListings] = useState([]);
  useEffect(() => { 
    axios.get('/user-items').then(({data}) => {
      setListings(data);
    });
  }, []);

  const deleteItem = (id) => {
    axios.delete(`/items/${id}`).then(() => {
      // Remove the item from state
      setListings(listings.filter((listing) => listing._id !== id));
    });
  }

  return (
    
      <div>
        <Link to="/addItem">
          <button>Add item</button>
        </Link>
        <div>
      {listings.map((listing) => (
        <React.Fragment key={listing._id}>
          <button onClick={() => deleteItem(listing._id)}>Delete</button>
          <Link to={'/uploader/' + listing._id}>
            <Listing listing={listing} />
          </Link>
        </React.Fragment>
      ))}
    </div>
    </div>
  )   
}
