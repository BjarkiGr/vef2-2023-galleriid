import LoginComponent from '../components/LoginComponent';

function LoginPage({ onLogin }) {
  return (
    <div className="login-page">
      <LoginComponent onLogin={onLogin} />
    </div>
  );
}

export default LoginPage;
