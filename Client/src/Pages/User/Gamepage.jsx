import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Radio, Space, Progress, Spin, Modal, Statistic } from 'antd';
import { ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getQuestionByIndex,
  submitAnswer,
  resetGame,
  updateTimeTaken,
  setCurrentMcqSetId,
} from '../../Redux/Slices/McqSlice';

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const GamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const mcqSetId = location.state?.mcqSetId;

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    isGameComplete,
    loading,
    timeTaken,
    totalScore,
  } = useSelector((state) => state.mcq || {});

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Format time to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update timer every second
  useEffect(() => {
    let timerInterval;
    if (gameStarted && !isGameComplete) {
      timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameStarted, startTime, isGameComplete]);

  useEffect(() => {
    if (!mcqSetId) {
      navigate('/games');
      return;
    }

    const initializeGame = async () => {
      setGameStarted(false);
      setElapsedTime(0);
      await dispatch(resetGame());
      dispatch(setCurrentMcqSetId(mcqSetId));
      const response = await dispatch(getQuestionByIndex({ index: 0, mcqSetId }));
      if (response.payload?.question) {
        setStartTime(Date.now());
        setGameStarted(true);
      } else {
        navigate('/games');
      }
    };

    initializeGame();

    return () => {
      dispatch(resetGame());
    };
  }, [dispatch, mcqSetId, navigate]);

  useEffect(() => {
    if (isGameComplete && gameStarted) {
      setShowGameOverModal(true);
    }
  }, [isGameComplete, gameStarted]);

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !gameStarted) {
      return;
    }

    const currentTime = Date.now();
    const timeTakenInSeconds = Math.floor((currentTime - startTime) / 1000);
    dispatch(updateTimeTaken(timeTakenInSeconds));

    const response = await dispatch(
      submitAnswer({
        index: currentIndex,
        selectedAnswer,
        timeTaken: timeTakenInSeconds,
        mcqSetId,
      })
    );

    setSelectedAnswer('');

    // Only fetch next question if it's not the last question and the current answer was correct
    if (!response.payload.completed && currentIndex < totalQuestions - 1) {
      await dispatch(
        getQuestionByIndex({
          index: currentIndex + 1,
          mcqSetId,
        })
      );
    }
  };

  const handleGameOver = () => {
    setShowGameOverModal(false);
    navigate('/games');
  };

  if (!gameStarted || (loading && !currentQuestion)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card loading={loading}>
        <div className="mb-4 flex justify-between items-center">
          <Progress
            percent={Math.max((currentIndex / (totalQuestions - 1)) * 100, 0)}
            format={() => `${currentIndex + 1}/${totalQuestions}`}
          />
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-2" />
            <Text
              strong
              className="text-lg">
              {formatTime(elapsedTime)}
            </Text>
          </div>
        </div>

        {currentQuestion && (
          <>
            <Title
              level={4}
              className="mb-4">
              {currentQuestion.question}
            </Title>

            <Radio.Group
              onChange={(e) => setSelectedAnswer(e.target.value)}
              value={selectedAnswer}
              className="w-full">
              <Space
                direction="vertical"
                className="w-full">
                {currentQuestion.options?.map((option, index) => (
                  <Radio
                    key={index}
                    value={option}
                    className="w-full p-3 border rounded hover:bg-gray-50">
                    {option}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <Button
              type="primary"
              className="mt-6"
              block
              disabled={!selectedAnswer}
              onClick={handleSubmitAnswer}>
              Submit Answer
            </Button>
          </>
        )}
      </Card>

      {/* Game Over Modal */}
      <Modal
        title="Game Over!"
        open={showGameOverModal && gameStarted}
        onOk={handleGameOver}
        onCancel={handleGameOver}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={handleGameOver}>
            Back to Games
          </Button>,
        ]}>
        <div className="text-center">
          <TrophyOutlined style={{ fontSize: '48px', color: '#ffd700', marginBottom: '16px' }} />
          <Title level={3}>{isGameComplete ? 'Congratulations!' : 'Better luck next time!'}</Title>
          <Text>Time taken: {formatTime(timeTaken)}</Text>
          <br />
          <Text strong>Total Score: {totalScore}</Text>
        </div>
      </Modal>
    </div>
  );
};

export default GamePage;
