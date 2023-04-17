import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import UserPage from './pages/UserPage';
import GetImagePage from './pages/GetImagePage';
import './App.css';

function Frontpage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      localStorage.clear();
      window.location.reload();
      return <div>'Útskráning tókst'</div>;
    } catch (error) {
      console.error(error);
    }
    setUser(null);
  };

  return (
    <Router>
      <nav className="nav-bar">
        <ul>
          <li className="nav-bar-item home">
            <Link
              className="home"
              to="/"
              onClick={() => (window.location.href = '/')}
            >
              Galleríið
            </Link>
          </li>
          {!user ? (
            <>
              <li className="nav-bar-item login">
                <Link to="/login">Innskrá</Link>
              </li>
              <li className="nav-bar-item register">
                <Link to="/register">Búa til aðgang</Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-bar-item upload">
                <Link to="/upload">Hlaða inn mynd</Link>
              </li>
              <li className="nav-bar-item logout">
                <Link to="#" className="logout-button" onClick={handleLogout}>
                  Útskrá
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path={`/users/:userId`} element={<UserPage user={user} />} />
        <Route path="/users/:userId" component={UserPage} />
        <Route path="/images/:id" element={<GetImagePage />} />
      </Routes>
    </Router>
  );
}

export default Frontpage;
