import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setError(null);
      const { user, token } = await response.json();
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      setEmail('');
      setPassword('');
      navigate('/');
      window.location.reload();
      return <div>'Innskráning tókst'</div>;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Innskráning</h2>
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

      <button className="login-button" type="submit">
        Innskrá
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginComponent;
