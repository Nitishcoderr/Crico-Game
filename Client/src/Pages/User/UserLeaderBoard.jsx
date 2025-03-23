import React, { useEffect } from 'react';
import { Table, Card, Typography, Tag } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaderboard } from '../../Redux/Slices/McqSlice';

const { Title } = Typography;

const UserLeaderBoard = () => {
  const dispatch = useDispatch();
  const { leaderboard = [], loading = false } = useSelector((state) => state.mcq || {});

  useEffect(() => {
    dispatch(getLeaderboard());
  }, [dispatch]);

  const columns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 80,
      render: (_, __, index) => (
        <div className="flex items-center">
          {index < 3 ? (
            <TrophyOutlined
              className={`mr-2 ${
                index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'
              }`}
            />
          ) : null}
          {index + 1}
        </div>
      ),
    },
    {
      title: 'Player Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Total Score',
      dataIndex: 'totalScore',
      key: 'totalScore',
      render: (score) => (
        <Tag
          color="blue"
          className="text-lg px-3 py-1">
          {score}
        </Tag>
      ),
    },
  ];

  return (
    <Card className="shadow-lg">
      <Title
        level={4}
        className="mb-4 text-center">
        🏆 Leaderboard
      </Title>
      <Table
        dataSource={leaderboard}
        columns={columns}
        loading={loading}
        rowKey="userId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} players`,
        }}
      />
    </Card>
  );
};

export default UserLeaderBoard;
