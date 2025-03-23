import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, PlayCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/Slices/AuthSlice';

const { Header, Content } = Layout;

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate('/');
    }
  };

  const items = [
    {
      key: 'play',
      icon: <PlayCircleOutlined />,
      label: 'Play Game',
      onClick: () => navigate('/games'),
    },
    {
      key: 'leaderboard',
      icon: <PlayCircleOutlined />,
      label: 'Leaderboard',
      onClick: () => navigate('/leaderboard'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/user/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <Menu
          mode="horizontal"
          items={items}
        />
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ minHeight: 360 }}>{children}</div>
      </Content>
    </Layout>
  );
};

export default UserLayout;
