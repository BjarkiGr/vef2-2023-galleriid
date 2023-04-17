import RegisterComponent from '../components/RegisterComponent';

function RegisterPage({ onRegister }) {
  return (
    <div className="register-page">
      <RegisterComponent onRegister={onRegister} />
    </div>
  );
}

export default RegisterPage;
