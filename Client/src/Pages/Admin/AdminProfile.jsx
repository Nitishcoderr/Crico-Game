import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Descriptions,
  message,
  Avatar,
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, updateProfile } from '../../Redux/Slices/AuthSlice';

const { Title } = Typography;

const AdminProfile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const userData = useSelector((state) => state.auth.data);

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        fullName: userData.fullName,
        email: userData.email,
        mobile: userData.mobile,
        age: userData.age,
      });
    }
  }, [userData, form]);

  const handleSubmit = async (values) => {
    try {
      const res = await dispatch(updateProfile({ id: userData._id, ...values }));
      if (res?.payload?.success) {
        message.success('Profile updated successfully!');
        setIsEditing(false);
        dispatch(getUserData());
      }
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title={
          <div className="flex justify-between items-center">
            <Title level={2}>Admin Profile</Title>
            {!isEditing ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => form.submit()}>
                  Save
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setIsEditing(false);
                    form.resetFields();
                  }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        }>
        <div className="flex flex-col items-center mb-6">
          {/* <Title
            level={4}
            className="mt-4">
            {userData?.fullName}
          </Title> */}
          <div className="text-gray-500">Administrator</div>
        </div>

        {!isEditing ? (
          <Descriptions
            column={1}
            bordered>
            <Descriptions.Item label="Full Name">{userData?.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData?.email}</Descriptions.Item>
            <Descriptions.Item label="Mobile Number">{userData?.mobile}</Descriptions.Item>
            <Descriptions.Item label="Age">{userData?.age}</Descriptions.Item>
            <Descriptions.Item label="Role">Administrator</Descriptions.Item>
          </Descriptions>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              fullName: userData?.fullName,
              email: userData?.email,
              mobile: userData?.mobile,
              age: userData?.age,
            }}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: 'Please input your mobile number!' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number!' },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              name="age"
              label="Age"
              rules={[
                { required: true, message: 'Please input your age!' },
                { type: 'number', min: 1, message: 'Age must be greater than 0!' },
              ]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Role">
              <Input
                defaultValue="Administrator"
                disabled
              />
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AdminProfile;
