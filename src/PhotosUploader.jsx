import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/PhotoUploader.module.css';

export default function PhotosUploader({ onChange, initialPhotos = [] }) {
  // State to manage added photos and drag-and-drop behavior
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [dragging, setDragging] = useState(false);

  // URL of the backend server
  const backendUrl = 'https://backendsellandbuy-516d9183eb68.herokuapp.com';

  // Set initial photos when the component mounts or 'initialPhotos' prop changes
  useEffect(() => {
    setAddedPhotos(initialPhotos);
  }, [initialPhotos]);

  // Function to upload photos
  const uploadPhoto = (ev) => {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    // Send a POST request to upload photos to the backend
    axios.post(`/upload`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response) => {
      const { data: filenames } = response;
      // Update added photos and call the 'onChange' prop
      setAddedPhotos((prev) => [...prev, ...filenames]);
      onChange([...addedPhotos, ...filenames]);
    });
  };

  // Function to delete a photo
  const deletePhoto = (photoToDelete) => {
    // Remove the photo from the added photos list
    setAddedPhotos((prev) => prev.filter((photo) => photo !== photoToDelete));
    // Notify the parent component of the change using 'onChange' prop
    onChange(addedPhotos.filter((photo) => photo !== photoToDelete));
  };

  // Event handler for when a file is dragged into the drop area
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Event handler for when a file is dragged out of the drop area
  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  // Event handler for when a file is dragged over the drop area
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  // Event handler for when files are dropped into the drop area
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Upload dropped files and clear data transfer
      uploadPhoto({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Added Photos</h2>

      {/* Drop area for photos */}
      <div
        className={`${styles.place} ${dragging ? styles.dragging : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
      >
        {/* Display added photos */}
        {addedPhotos.length > 0 && addedPhotos.map((photo, index) => (
          <div key={index} className={styles.imageContainer}>
            <img
              src={`${backendUrl}/uploads/${photo}`}
              alt="Uploaded"
            />
            {/* Button to delete the photo */}
            <button onClick={() => deletePhoto(photo)} className={styles.deleteButton}>x</button>
          </div>
        ))}
      </div>

      {/* Input for selecting photos */}
      <label htmlFor="photo" className={styles.label}>
        Choose Photos
        <input type="file" id="photo" multiple name="photo" onChange={uploadPhoto} className={styles.fileInput} />
      </label>
    </div>
  );
}
