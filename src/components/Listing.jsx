import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ListingShow.css';
function Listing({ listing }) {

    
    return (
          
             <div className="listing-item">
              <div className="listing-image-wrapper">
                  <img src={listing.photos[0]} alt="" className="listing-image" />

                      </div>
                     <div className="listing-details">
                        <div className="listing-text">
                        <h3 className="listing-name">{listing.title}</h3>
                        <p className="listing-description">
                            
                            {listing.description}
                        </p>
                    </div>
                     <div className="listing-right">
                             <p className="listing-price">{listing.price} zl</p>
                                 <p className="listing-city">{listing.address}</p>
                    </div>
            </div>
     </div>
     
    );
    
}

export default Listing;
