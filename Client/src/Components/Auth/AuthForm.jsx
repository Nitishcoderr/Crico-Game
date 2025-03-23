import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Tabs, InputNumber } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, createAccount } from '../../Redux/Slices/AuthSlice';

const { Title } = Typography;

const AuthForm = ({ type = 'user-login', showRegisterLink = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = type.includes('login');
  const isAdmin = type === 'admin-login';
  const [loginType, setLoginType] = useState('email');
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (isLogin) {
      const loginData = {
        password: values.password,
        role: isAdmin ? 'admin' : 'user',
      };

      // Add either email or mobile based on login type
      if (loginType === 'email') {
        loginData.email = values.email;
      } else {
        loginData.mobile = values.mobile;
      }

      const res = await dispatch(login(loginData));
      if (res?.payload?.success) {
        navigate(isAdmin ? '/admin/dashboard' : '/games');
      }
    } else {
      // For registration, rename name to fullName to match server expectations
      const registerData = {
        ...values,
        fullName: values.name,
      };
      delete registerData.confirmPassword;
      delete registerData.name;

      const res = await dispatch(createAccount(registerData));
      if (res?.payload?.success) {
        navigate('/login');
      }
    }
  };

  const loginItems = [
    {
      key: 'email',
      label: 'Email',
      children: (
        <Form.Item
          name="email"
          rules={[
            { required: loginType === 'email', message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}>
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </Form.Item>
      ),
    },
    {
      key: 'mobile',
      label: 'Mobile',
      children: (
        <Form.Item
          name="mobile"
          rules={[
            { required: loginType === 'mobile', message: 'Please input your mobile number!' },
            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
          ]}>
          <Input
            prefix={<MobileOutlined />}
            placeholder="Mobile Number"
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Card style={{ width: 400, padding: '24px' }}>
      <Title
        level={2}
        style={{ textAlign: 'center', marginBottom: 32 }}>
        {isLogin ? (isAdmin ? 'Admin Login' : 'User Login') : 'Register'}
      </Title>

      <Form
        form={form}
        name="auth_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical">
        {isLogin ? (
          <>
            <Tabs
              activeKey={loginType}
              onChange={setLoginType}
              items={loginItems}
              style={{ marginBottom: '16px' }}
            />
          </>
        ) : (
          <>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}>
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="mobile"
              rules={[
                { required: true, message: 'Please input your mobile number!' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
              ]}>
              <Input
                prefix={<MobileOutlined />}
                placeholder="Mobile Number"
              />
            </Form.Item>

            <Form.Item
              name="age"
              rules={[
                { required: true, message: 'Please input your age!' },
                { type: 'number', min: 1, message: 'Age must be greater than 0!' },
              ]}>
              <InputNumber
                prefix={<NumberOutlined />}
                placeholder="Age"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { len: 4, message: 'Password must be exactly 4 digits!' },
            { pattern: /^[0-9]{4}$/, message: 'Password must contain only digits!' },
          ]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="4-digit Password"
            maxLength={4}
          />
        </Form.Item>

        {!isLogin && (
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              maxLength={4}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}>
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Form.Item>

        {showRegisterLink && isLogin && (
          <div style={{ textAlign: 'center' }}>
            Don't have an account? <Link to="/register">Register now!</Link>
          </div>
        )}
      </Form>
    </Card>
  );
};

export default AuthForm;
