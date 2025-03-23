import React, { useEffect } from 'react';
import { Button, Card, Table, Tag, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMcqs, deleteMcqSet } from '../../Redux/Slices/McqSlice';
import dayjs from 'dayjs';

const { Title } = Typography;

const SetMcq = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mcqSets, loading } = useSelector((state) => state.mcq);

  useEffect(() => {
    dispatch(getAllMcqs());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMcqSet(id)).unwrap();
    } catch (error) {
      message.error('Failed to delete MCQ set');
    }
  };

  // Function to check if MCQ set is editable (today or future dated)
  const isEditable = (scheduledDate) => {
    const today = dayjs().startOf('day');
    const mcqDate = dayjs(scheduledDate, 'DD-MM-YYYY').startOf('day');
    return mcqDate.isSame(today) || mcqDate.isAfter(today);
  };

  // Function to get status and color based on date
  const getStatusAndColor = (scheduledDate) => {
    const today = dayjs().startOf('day');
    const mcqDate = dayjs(scheduledDate, 'DD-MM-YYYY').startOf('day');

    if (mcqDate.isBefore(today)) {
      return { status: 'Expired', color: 'red' };
    } else if (mcqDate.isSame(today)) {
      return { status: 'Active', color: 'green' };
    } else {
      return { status: 'Scheduled', color: 'blue' };
    }
  };

  const columns = [
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date) => dayjs(date, 'DD-MM-YYYY').format('DD MMM YYYY'),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const { status, color } = getStatusAndColor(record.scheduledDate);
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'questions',
      render: (questions) => questions?.length || 0,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy) => createdBy?.fullName || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {isEditable(record.scheduledDate) && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/edit-mcq/${record._id}`)}
              className="bg-blue-500">
              Edit
            </Button>
          )}
          <Popconfirm
            title="Delete MCQ Set"
            description="Are you sure you want to delete this MCQ set?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No">
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>MCQ Sets</Title>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/new-mcq')}
          className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600">
          Create New MCQ Set
        </Button>
      </div>

      <Card className="shadow-lg rounded-lg">
        <Table
          columns={columns}
          dataSource={[...mcqSets].sort((a, b) => {
            const dateA = dayjs(a.scheduledDate, 'DD-MM-YYYY');
            const dateB = dayjs(b.scheduledDate, 'DD-MM-YYYY');
            return dateB - dateA;
          })}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default SetMcq;
