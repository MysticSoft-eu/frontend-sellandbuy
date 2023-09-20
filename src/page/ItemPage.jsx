import React, { useEffect, useState } from "react";
import axios from 'axios';
import  "../styles/ItemPage.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
export default function ItemPage() {
  const [item, setItem] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/items/${id}`)
      .then(response => {
        setItem(response.data);
        setCurrentPhotoIndex(0);   console.log(response.data.photos[1])// Reset photo index when a new item is loaded
      })
    
      .catch(error => console.error(error));
  }, [id]);

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prevIndex => prevIndex - 1);
    }
  }

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
        <img 
            src={`${item.photos[currentPhotoIndex]}`} 
            alt={`${item.title}-${currentPhotoIndex}`} 
            className="photo"
        />
        <button className="navButton prev" onClick={handlePrevious}>←</button>
        <button className="navButton next" onClick={handleNext}>→</button>
    </div>
    <div className="thumbnailPhotos">
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
            {item.category.map((category, index) => (
              <li key={index}>
                
                <Link to={`/category/${category}`}>{category}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}</div>
   

                <div className="itemInfo">
                  <div className="itemInfoTop">

                <h2 className="itemTitle">{item.title}</h2>
                
                <p className="itemDescription">Description:{item.description}</p>
                </div>

                <div className="itemBotton" >
                  {item.price !== 0 && <p className="price">Price: {item.price}zl</p>}
                  <p className="address">City:{item.address}</p>
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
