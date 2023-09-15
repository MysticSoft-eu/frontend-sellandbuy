import { useState,createContext, useEffect } from "react";
import axios from "axios";
import styles from '../styles/PhotoUploader.module.css';


function Test({ onChange, initialPhotos = [] })  {
  const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});

  const handleSelectFile = (e) => {
  setFile(e.target.files[0]);
}
useEffect(() => {
    if (initialPhotos && initialPhotos.length > 0) {
        setAddedPhotos(initialPhotos);
    }
  }, [initialPhotos]);
  

  const [addedPhotos, setAddedPhotos] = useState([]);
  const [dragging, setDragging] = useState(false);


  useEffect(() => {
    if (file) {
      handleUpload();
    }
  }, [file]);
  

  const handleUpload = async () => {
    try {
    //   setLoading(true);
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
    } finally {
    //   setLoading(false);
    }

  };
  const deletePhoto = (photoToDelete) => {
    const newPhotos = addedPhotos.filter(photo => photo !== photoToDelete);
    setAddedPhotos(newPhotos);
    onChange(newPhotos);
  };
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
      
        select file
     
      {file && <center> {file.name}</center>}
      <input
        id="file"
        type="file"
        onChange={handleSelectFile}
        multiple={false}
      />
      <div className={`${styles.place} ${dragging ? styles.dragging : ''}`}
             onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}>  
              
              {
              addedPhotos.map((photoUrl, index) => (
              photoUrl && (
              <div key={index} className={styles.imageContainer}>
                <img src={photoUrl} alt='' />
                <button onClick={() => deletePhoto(photoUrl)} className={styles.deleteButton}>x</button>
            </div>
        )
        ))
       }


        </div>
       
      </div>
    </div>
  );
}
export default Test;      