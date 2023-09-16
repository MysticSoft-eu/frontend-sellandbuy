import React, { useEffect, useState } from "react";
import axios from 'axios';
import styles from "../styles/Listing.module.css";
import { Link } from "react-router-dom";

const Listing = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    axios.get('/items')
      .then(response => setListings(response.data))
      .catch(error => console.error(error));
      console.log(listings);
  }, []);

  return (
    <div className={styles.listingContainer}>
      <h2 className={styles.title}>Latest Listings</h2>
      <div className={styles.listingItems}>
        {listings.map((listing) => (
        <Link to={'/itempage/'+listing._id} >
        <div className={styles.listingItem} key={listing.id}>
    
    <div className={styles.listingBottom}>
        <div className={styles.listingImageWrapper}>
            <img src={listing.photos[0]} alt="" className={styles.listingImage} />
        </div>
        <div className={styles.listingDetails}>
            
                
        <span className={styles.listingName}>{listing.title}</span>
                
                <div className={styles.listing} >
                  
                <p className={styles.listingPrice}>{listing.price} zl</p>
                <p className={styles.listingCity}>{listing.address}</p>
            </div>
            </div>
        </div>
   
</div>



          
        </Link> 
        ))}

      </div>
    </div>
  );
};

export default Listing;
