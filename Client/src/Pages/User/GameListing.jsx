import React, { useEffect } from 'react';
import { Card, Typography, Button, Row, Col, Empty, Spin, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllMcqs } from '../../Redux/Slices/McqSlice';
import { CalendarOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GameListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mcqSets = [], loading } = useSelector((state) => state.mcq || {});

  useEffect(() => {
    dispatch(getAllMcqs());
  }, [dispatch]);

  const isGamePlayable = (scheduledDate, hasPlayed) => {
    if (hasPlayed) return false;

    const [day, month, year] = scheduledDate.split('-').map(Number);
    const gameDate = new Date(year, month - 1, day);
    const today = new Date();

    // Reset time part for accurate date comparison
    today.setHours(0, 0, 0, 0);
    gameDate.setHours(0, 0, 0, 0);

    return gameDate.getTime() === today.getTime();
  };

  const getGameStatus = (scheduledDate, hasPlayed) => {
    const [day, month, year] = scheduledDate.split('-').map(Number);
    const gameDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    gameDate.setHours(0, 0, 0, 0);

    if (hasPlayed) {
      return {
        text: 'Completed',
        color: 'success',
        icon: <TrophyOutlined />,
      };
    }

    if (gameDate.getTime() === today.getTime()) {
      return {
        text: 'Available Now',
        color: 'processing',
        icon: <ClockCircleOutlined />,
      };
    }

    if (gameDate.getTime() < today.getTime()) {
      return {
        text: 'Expired',
        color: 'error',
        icon: <ClockCircleOutlined />,
      };
    }

    return {
      text: 'Upcoming',
      color: 'warning',
      icon: <CalendarOutlined />,
    };
  };

  const handlePlayGame = (mcqSet) => {
    if (isGamePlayable(mcqSet.scheduledDate, mcqSet.hasPlayed)) {
      navigate('/play', { state: { mcqSetId: mcqSet._id } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Sort mcqSets by scheduledDate and createdAt in descending order
  const sortedMcqSets = [...mcqSets].sort((a, b) => {
    const [dayA, monthA, yearA] = a.scheduledDate.split('-').map(Number);
    const [dayB, monthB, yearB] = b.scheduledDate.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    if (dateB.getTime() === dateA.getTime()) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    return dateB - dateA;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Title
        level={2}
        className="text-center mb-8">
        Cricket MCQ Games
      </Title>

      {sortedMcqSets.length === 0 ? (
        <Empty description="No games available" />
      ) : (
        <Row gutter={[16, 16]}>
          {sortedMcqSets.map((mcqSet) => {
            const status = getGameStatus(mcqSet.scheduledDate, mcqSet.hasPlayed);

            return (
              <Col
                xs={24}
                sm={12}
                md={8}
                key={mcqSet._id}>
                <Card
                  hoverable={isGamePlayable(mcqSet.scheduledDate, mcqSet.hasPlayed)}
                  className={`h-full ${
                    !isGamePlayable(mcqSet.scheduledDate, mcqSet.hasPlayed) ? 'opacity-75' : ''
                  }`}>
                  <div className="flex justify-between items-start mb-4">
                    <Title level={4}>{mcqSet.scheduledDate}</Title>
                    <Tag
                      icon={status.icon}
                      color={status.color}>
                      {status.text}
                    </Tag>
                  </div>

                  <div className="mb-4">
                    <Text type="secondary">
                      Created by: {mcqSet.createdBy?.fullName || 'Unknown'}
                    </Text>
                    <br />
                    <Text type="secondary">Questions: {mcqSet.questions?.length || 0}</Text>
                  </div>

                  <Button
                    type="primary"
                    block
                    disabled={!isGamePlayable(mcqSet.scheduledDate, mcqSet.hasPlayed)}
                    onClick={() => handlePlayGame(mcqSet)}>
                    {mcqSet.hasPlayed ? 'Already Played' : 'Play Now'}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default GameListing;