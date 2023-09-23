import React, { useEffect, useState } from "react";
import axios from 'axios';
import  "../styles/ItemPage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ItemPage() {
  // State to store item data and current photo index
  const [item, setItem] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Get the item ID from the URL parameters
  const { id } = useParams();

  // Fetch item data when the component mounts or the item ID changes
  useEffect(() => {
    axios.get(`/items/${id}`)
      .then(response => {
        setItem(response.data);
        setCurrentPhotoIndex(0); // Reset photo index when a new item is loaded
      })
      .catch(error => console.error(error));
  }, [id]);

  // Function to handle going to the previous photo
  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prevIndex => prevIndex - 1);
    }
  }

  // Function to handle going to the next photo
  const handleNext = () => {
    if (currentPhotoIndex < (item?.photos.length || 0) - 1) {
      setCurrentPhotoIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <div className="items">
      <div className="itemContainer">
        {item && (
          <div>
            <div className="photoContainer">
              <div className="mainPhoto">
                {/* Display the main item photo */}
                <img 
                  src={`${item.photos[currentPhotoIndex]}`} 
                  alt={`${item.title}-${currentPhotoIndex}`} 
                  className="photo"
                />
                {/* Buttons to navigate to previous and next photos */}
                <button className="navButton prev" onClick={handlePrevious}>←</button>
                <button className="navButton next" onClick={handleNext}>→</button>
              </div>
              <div className="thumbnailPhotos">
                {/* Display thumbnail photos and make the current one active */}
                {item.photos.map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`${item.title}-${index}`} 
                    className={`thumbnailPhoto ${index === currentPhotoIndex ? 'active' : ''}`}
                    onClick={() => setCurrentPhotoIndex(index)}
                  />
                ))}
              </div>
            </div>
            <div className="itemInfoContainer">
              {item.category && (
                <div>
                  <ul className="category-list">
                    <p className="category">Category:</p>
                    {/* Display categories and link to their respective pages */}
                    {item.category.map((category, index) => (
                      <li key={index}>
                        <Link to={`/category/${category}`}>{category}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="itemInfo">
              <div className="itemInfoTop">
                <h2 className="itemTitle">{item.title}</h2>
                <p className="itemDescription">Description: {item.description}</p>
              </div>
              <div className="itemBotton" >
                {/* Display item price and city */}
                {item.price !== 0 && <p className="price">Price: {item.price}zl</p>}
                <p className="address">City: {item.address}</p>
                {/* Link to the chat page for this item */}
                <Link to={`/chatpage/${item._id}`}>
                  <button className="itemButton">Send message </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
