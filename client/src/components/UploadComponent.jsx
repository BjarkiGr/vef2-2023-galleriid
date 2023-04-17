import React from 'react';
import { useNavigate } from 'react-router-dom';

function UploadComponent() {
  const navigate = useNavigate();

  const handleUpload = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id;

    formData.append('userId', userId);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      alert('Tókst að hlaða inn mynd!');
      navigate('/');
    } catch (error) {
      alert(`Villa við að hlaða inn mynd: ${error.message}`);
    }
  };

  return (
    <div className="upload-container">
      <form
        className="upload-form"
        onSubmit={handleUpload}
        encType="multipart/form-data"
      >
        <h1 className="upload-title">Hlaða inn mynd</h1>

        <label className="input-text">
          Heiti:
          <br></br>
          <input className="upload-input-name" type="text" name="name" />
        </label>
        <br />
        <label className="input-text">
          Lýsing:
          <br></br>
          <textarea
            className="upload-input-description"
            name="description"
            rows="4"
          />
        </label>
        <br />
        <label className="input-text">
          Tög (aðskiljið með kommu):
          <br></br>
          <input className="upload-input-tags" type="text" name="tags" />
        </label>
        <br />
        <label className="input-text">
          Mynd:
          <br></br>
          <input
            className="upload-input-file"
            type="file"
            name="image"
            accept="image/*"
          />
        </label>
        <br />
        <button className="upload-button" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadComponent;
