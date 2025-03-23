import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { UserOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import HomePageImage from '../assets/Images/homePageMainImage.jpg';

const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'User Login',
      icon: <UserOutlined style={{ fontSize: '32px' }} />,
      onClick: () => navigate('/login'),
    },
    {
      title: 'Admin Login',
      icon: <LockOutlined style={{ fontSize: '32px' }} />,
      onClick: () => navigate('/admin/login'),
    },
    {
      title: 'Register New User',
      icon: <UserAddOutlined style={{ fontSize: '32px' }} />,
      onClick: () => navigate('/register'),
    },
  ];

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
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '40px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1200px',
        }}>
        <Title
          level={1}
          style={{ textAlign: 'center', marginBottom: '40px' }}>
          Welcome to Online Cricket
        </Title>
        <Row
          gutter={[24, 24]}
          justify="center">
          {cards.map((card, index) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              key={index}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                onClick={card.onClick}>
                {card.icon}
                <Title
                  level={3}
                  style={{ marginTop: '16px' }}>
                  {card.title}
                </Title>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
