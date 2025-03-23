import React, { useRef } from 'react';
import { Table, Card, Typography, Tag, Button } from 'antd';
import { TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';

const { Title } = Typography;

const TopScorersTable = ({ data, loading }) => {
  const tableRef = useRef(null);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatMobile = (mobile) => {
    if (!mobile) return '-';
    return mobile.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  const handleScreenshot = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'top_scorers.png';
        link.click();
      });
    }
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
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
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (mobile) => formatMobile(mobile),
    },
    {
      title: 'Total Score',
      dataIndex: 'totalScore',
      key: 'totalScore',
      sorter: (a, b) => a.totalScore - b.totalScore,
      defaultSortOrder: 'descend',
      render: (score) => (
        <Tag
          color="blue"
          className="text-lg px-3 py-1">
          {score}
        </Tag>
      ),
    },
    {
      title: 'Games',
      dataIndex: 'gamesPlayed',
      key: 'gamesPlayed',
      align: 'center',
      render: (games) => (
        <Tag
          color="green"
          className="px-3 py-1">
          {games}
        </Tag>
      ),
    },
    {
      title: 'Time Taken',
      dataIndex: 'totalTime',
      key: 'totalTime',
      render: (time) => (
        <span className="flex items-center">
          <ClockCircleOutlined className="mr-2" />
          {formatTime(time)}
        </span>
      ),
      sorter: (a, b) => a.totalTime - b.totalTime,
    },
    {
      title: 'Last Played',
      dataIndex: 'lastPlayed',
      key: 'lastPlayed',
      render: (date) => date || '-',
    },
  ];

  return (
    <Card className="shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <Title level={4}>Top Scorers</Title>
        <Button type="primary" onClick={handleScreenshot}>
          Take Screenshot
        </Button>
      </div>
      <div ref={tableRef}>
        <Table
          dataSource={data.slice(0, 10)} // Display only top 10 for screenshot
          columns={columns}
          loading={loading}
          rowKey="userId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} players`,
          }}
        />
      </div>
    </Card>
  );
};

export default TopScorersTable;