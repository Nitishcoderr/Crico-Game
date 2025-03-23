import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import UserStatsCard from '../../Components/Card/UserStatsCard';
import TopScorersTable from '../../Components/Table/TopScorersTable';
import UserActivityChart from '../../Components/Chart/UserActivityChart';
import { getTotalUsers, getUserActivity } from '../../Redux/Slices/AdminSlice';
import { getLeaderboard } from '../../Redux/Slices/McqSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    totalUsers = 0,
    userActivity = [],
    loading: adminLoading = false,
  } = useSelector((state) => state.admin || {});
  const { leaderboard = [], loading: mcqLoading = false } = useSelector((state) => state.mcq || {});

  useEffect(() => {
    dispatch(getTotalUsers());
    dispatch(getUserActivity());
    dispatch(getLeaderboard());
  }, [dispatch]);

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col
          xs={24}
          sm={24}
          md={8}
          lg={6}>
          <UserStatsCard
            totalUsers={totalUsers}
            loading={adminLoading}
          />
        </Col>

        <Col xs={24}>
          <TopScorersTable
            data={leaderboard}
            loading={mcqLoading}
          />
        </Col>

        <Col xs={24}>
          <UserActivityChart
            data={userActivity}
            loading={adminLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
