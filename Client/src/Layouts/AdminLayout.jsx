import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { UserOutlined, DashboardOutlined, LogoutOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/Slices/AuthSlice';
// import { useTheme } from '../Helpers/ThemeContext';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate('/');
    }
  };

  const items = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: 'CreateMcq',
      icon: <AppstoreAddOutlined />,
      label: 'Create Mcq',
      onClick: () => navigate('/admin/set-mcq'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile'),
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
      <Sider
        breakpoint="lg"
        collapsedWidth="0">
        <div
          className="logo"
          style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.9)' }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} />
        {/* <Button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </Button> */}
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
