import React from 'react';
import AuthForm from '../../Components/Auth/AuthForm';
import HomePageImage from '../../assets/Images/homePageMainImage.jpg';

const Register = () => {
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
        type="register"
        showRegisterLink={false}
      />
    </div>
  );
};

export default Register;
