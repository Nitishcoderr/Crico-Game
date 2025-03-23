import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '../../Components/Auth/AuthForm';
import HomePageImage from '../../assets/Images/homePageMainImage.jpg';

const Login = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${HomePageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
      <AuthForm
        type={isAdmin ? 'admin-login' : 'user-login'}
        showRegisterLink={!isAdmin}
      />
    </div>
  );
};

export default Login;
