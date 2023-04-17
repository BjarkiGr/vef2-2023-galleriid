import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ImagesComponent() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/images`
      );
      const images = await response.json();
      setImages(images);
    }
    fetchImages();
  }, []);

  function shorten(str, length) {
    if (str === null) {
      return '';
    }
    if (str.length > length) {
      return str.substring(0, length) + '...';
    } else {
      return str;
    }
  }

  return (
    <div className="images-container">
      <div className="image-list">
        {images.map((image) => (
          <div className="image-container" key={image.id}>
            <Link to={`/images/${image.id}`}>
              <img
                className="image"
                src={`data:image/jpeg;base64,${image.imageData}`}
                alt={image.name}
              />
            </Link>
            <p className="file-size">
              Stærð myndar: {(image.filesize / (1024 * 1024)).toFixed(2)} MB{' '}
            </p>
            <p className="date-created">
              Sett inn: {new Date(image.created_at).toLocaleString()}
            </p>

            <h2 className="image-title">{image.name}</h2>

            <p className="image-description-short">
              {shorten(image.description, 100)}
            </p>
            <p className="image-tags-short">
              {image.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
              {image.tags.length > 3 && '...'}
            </p>
            <p className="image-owner">
              <a className="image-owner" href={`/users/${image.username}`}>
                {image.username}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImagesComponent;
