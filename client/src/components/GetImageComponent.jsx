import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function GetImageComponent() {
  const { id } = useParams();
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchImage() {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/images/${id}`
      );
      const image = await response.json();
      setImage(image);
    }
    fetchImage();
  }, [id]);

  if (!image) {
    return <div className="image-loading">Hleð inn mynd...</div>;
  }

  return (
    <div className="image-container">
      <img
        className="image-full"
        src={`data:image/jpeg;base64,${image.imageData}`}
        alt={image.name}
      />
      <h2 className="image-title">{image.name}</h2>
      <p className="file-size">
        File size: {(image.filesize / (1024 * 1024)).toFixed(2)} MB{' '}
      </p>
      <p className="date-created">
        Date created: {new Date(image.created_at).toLocaleString()}
      </p>

      <p className="image-description-full">{image.description}</p>
      <p className="image-tags-full">
        Tags:{' '}
        {image.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </p>
      <p className="image-owner">
        <a href={`/users/${image.username}`}>{image.username}</a>
      </p>
    </div>
  );
}

export default GetImageComponent;
