import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterComponent() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Lykilorð stemma ekki');
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setError(null);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
      return <div>'Nýskráning tókst'</div>;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Nýskráning</h2>
      <label className="input-text">
        Notendanafn:
        <br></br>
        <input
          className="username-input"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>
      <br />
      <label className="input-text">
        Netfang:
        <br></br>
        <input
          className="email-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <br />
      <label className="input-text">
        Lykilorð:
        <br></br>
        <input
          className="password-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      <br />
      <label className="input-text">
        Staðfesta lykilorð:
        <br></br>
        <input
          className="password-input"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </label>
      <br />
      <button className="register-button" type="submit">
        Nýskrá
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default RegisterComponent;
