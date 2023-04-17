import { useEffect, useState } from 'react';

function UserComponent(props) {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/user/${props.userId}`
        );

        const data = await response.json();

        setUser(data.user);
        setImages(data.images);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserData();
  }, [props.userId]);

  if (!user) {
    return <div className="user-loading">Hleð inn notanda...</div>;
  }

  return (
    <div className="user-info">
      <h2 className="user-username">Galleríið hjá {user.username}</h2>
      <p className="user-joindate">
        Notandi stofnaður: {new Date(user.created_at).toLocaleString()}
      </p>
      <div className="images-container">
        <div className="image-list">
          {images.length > 0 &&
            images.map((image) => (
              <div className="image-container" key={image.id}>
                <h3 className="image-title">{image.name}</h3>
                <img
                  className="image"
                  src={`data:image/jpeg;base64,${image.imageData}`}
                  alt={image.name}
                />
                <p className="file-size">
                  File size: {(image.filesize / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p className="date-created">
                  Sett inn: {new Date(image.created_at).toLocaleString()}
                </p>
                <p className="image-owner">
                  Uploaded by:{' '}
                  <a href={`/users/${image.username}`}>{image.username}</a>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default UserComponent;
