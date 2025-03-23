import React, { useState, useEffect } from 'react';
import { Card, Typography, Radio, Spin } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch } from 'react-redux';
import { getUserActivity } from '../../Redux/Slices/AdminSlice';

const { Title } = Typography;

const UserActivityChart = ({ data = [], loading }) => {
  const dispatch = useDispatch();
  const [timeFilter, setTimeFilter] = useState('daily');

  useEffect(() => {
    dispatch(getUserActivity(timeFilter));
  }, [dispatch, timeFilter]);

  const handleFilterChange = (e) => {
    setTimeFilter(e.target.value);
    dispatch(getUserActivity(e.target.value));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';

    const date = new Date(
      timeFilter === 'yearly'
        ? `${dateStr}-01`
        : dateStr
    );

    if (timeFilter === 'daily') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (timeFilter === 'yearly') {
      return date.toLocaleDateString([], { month: 'short' });
    }
    if (timeFilter === 'weekly') {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(
        timeFilter === 'yearly'
          ? `${label}-01`
          : label
      );

      const formattedDate =
        timeFilter === 'yearly'
          ? date.toLocaleDateString([], { month: 'long', year: 'numeric' })
          : timeFilter === 'weekly' || timeFilter === 'monthly'
          ? date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
          : formatDate(label);

      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="font-semibold">{formattedDate}</p>
          <p className="text-blue-600">New Users: {payload[0].value}</p>
          <p className="text-green-600">Total Users: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg">
      <Spin spinning={loading}>
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>User Registration Activity</Title>
          <Radio.Group
            value={timeFilter}
            onChange={handleFilterChange}>
            <Radio.Button value="daily">Daily</Radio.Button>
            <Radio.Button value="weekly">Weekly</Radio.Button>
            <Radio.Button value="monthly">Monthly</Radio.Button>
            <Radio.Button value="yearly">Yearly</Radio.Button>
          </Radio.Group>
        </div>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 1000]}
                ticks={[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="newUsers"
                name="New Users"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="totalUsers"
                name="Total Users"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Spin>
    </Card>
  );
};

export default UserActivityChart;
