import { useState, createContext, useEffect } from "react";
import axios from "axios";
import styles from '../styles/PhotoUploader.module.css';

function Test({ onChange, initialPhotos = [] }) {
  // State to store the selected file, upload response, and uploaded photos
  const [file, setFile] = useState(null);
  const [res, setRes] = useState({});
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [dragging, setDragging] = useState(false);

  // Handle the selection of a file
  const handleSelectFile = (e) => {
    setFile(e.target.files[0]);
  };

  // Initialize the component with initial photos if provided
  useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      setAddedPhotos(initialPhotos);
    }
  }, [initialPhotos]);

  // Trigger image upload when a file is selected
  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);

  // Handle the image upload
  const handleUpload = async () => {
    try {
      const data = new FormData();
      data.append("my_file", file);
      const res = await axios.post("/upload", data);
      const { secure_url } = res.data;
      if (secure_url) {
        setAddedPhotos([...addedPhotos, secure_url]);
        onChange([...addedPhotos, secure_url]);
      }
      setRes(res.data);
    } catch (error) {
      alert(error.message);
    }
  };

  // Delete a photo from the uploaded photos
  const deletePhoto = (photoToDelete) => {
    const newPhotos = addedPhotos.filter((photo) => photo !== photoToDelete);
    setAddedPhotos(newPhotos);
    onChange(newPhotos);
  };

  // Handle drag-and-drop events for file selection
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSelectFile({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="App">
      <div className={styles.container}>
        {/* Input for selecting a file */}
        <input
          id="file"
          type="file"
          onChange={handleSelectFile}
          multiple={false}
        />
        {/* Drag-and-drop area for files */}
        <div
          className={`${styles.place} ${dragging ? styles.dragging : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
        >
          {/* Display uploaded photos */}
          {addedPhotos.map((photoUrl, index) => (
            photoUrl && (
              <div key={index} className={styles.imageContainer}>
                <img src={photoUrl} alt="" />
                {/* Button to delete the uploaded photo */}
                <button
                  onClick={() => deletePhoto(photoUrl)}
                  className={styles.deleteButton}
                >
                  x
                </button>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

export default Test;
