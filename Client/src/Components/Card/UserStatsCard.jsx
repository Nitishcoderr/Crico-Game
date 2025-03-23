import React from 'react';
import { Card, Typography, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserStatsCard = ({ totalUsers, loading }) => {
  return (
    <Card
      className="shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        borderRadius: '1rem',
        border: 'none',
      }}>
      <Spin spinning={loading}>
        <div className="flex items-center justify-between">
          <div>
            <Text className="text-white opacity-80">Total Users</Text>
            <Title
              level={2}
              className="!text-white !mb-0">
              {totalUsers}
            </Title>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <UserOutlined className="text-2xl text-white" />
          </div>
        </div>
      </Spin>
    </Card>
  );
};

export default UserStatsCard;
