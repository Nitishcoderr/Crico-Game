import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  DatePicker,
  Space,
  message,
  Tooltip,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DragOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { createMcqSet, updateMcqSet } from '../../Redux/Slices/McqSlice';

dayjs.extend(customParseFormat);
const { Title } = Typography;

const NewMcq = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { mcqSets } = useSelector((state) => state.mcq);
  const [questions, setQuestions] = useState([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    },
  ]);

  useEffect(() => {
    if (id) {
      const mcqSet = mcqSets.find((set) => set._id === id);
      if (mcqSet) {
        form.setFieldsValue({
          scheduledDate: dayjs(mcqSet.scheduledDate, 'DD-MM-YYYY'),
        });

        const questionsWithIds = mcqSet.questions.map((q, index) => ({
          ...q,
          id: String(index + 1),
        }));
        setQuestions(questionsWithIds);
      } else {
        message.error('MCQ set not found');
        navigate('/admin/set-mcq');
      }
    }
  }, [id, mcqSets, form, navigate]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
  };

  const addQuestion = () => {
    if (questions.length >= 6) {
      message.warning('Maximum 6 questions allowed');
      return;
    }
    setQuestions([
      ...questions,
      {
        id: String(questions.length + 1),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) {
      message.warning('At least one question is required');
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    // Clear correct answer if the selected option is modified
    if (
      newQuestions[questionIndex].correctAnswer === questions[questionIndex].options[optionIndex]
    ) {
      newQuestions[questionIndex].correctAnswer = '';
    }
    setQuestions(newQuestions);
  };

  const validateQuestions = () => {
    if (questions.length !== 6) {
      message.error('Exactly 6 questions are required');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        message.error(`Question ${i + 1} is empty`);
        return false;
      }
      if (q.options.some((opt) => !opt.trim())) {
        message.error(`All options for question ${i + 1} are required`);
        return false;
      }
      if (!q.correctAnswer) {
        message.error(`Please select a correct answer for question ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (values) => {
    try {
      if (!validateQuestions()) return;

      const formattedQuestions = questions.map(({ question, options, correctAnswer }) => ({
        question,
        options,
        correctAnswer,
      }));

      const payload = {
        questions: formattedQuestions,
        scheduledDate: values.scheduledDate.format('DD-MM-YYYY'),
      };

      if (id) {
        await dispatch(updateMcqSet({ id, payload })).unwrap();
      } else {
        await dispatch(createMcqSet(payload)).unwrap();
      }

      message.success(`MCQ set ${id ? 'updated' : 'created'} successfully`);
      navigate('/admin/set-mcq');
    } catch (error) {
      message.error(`Failed to ${id ? 'update' : 'create'} MCQ set`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>{id ? 'Edit' : 'Create New'} MCQ Set</Title>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/set-mcq')}>
              Back
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 border-0">
              {id ? 'Update' : 'Save'} MCQ Set
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical">
          <Form.Item
            name="scheduledDate"
            label="Scheduled Date"
            rules={[{ required: true, message: 'Please select a date' }]}>
            <DatePicker
              format="DD-MM-YYYY"
              className="w-full"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4">
                  {questions.map((question, questionIndex) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={questionIndex}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`mb-8 bg-white rounded-lg p-6 shadow-md border border-gray-100 transition-all ${
                            snapshot.isDragging
                              ? 'shadow-xl ring-2 ring-blue-500'
                              : 'hover:shadow-lg'
                          }`}>
                          <div className="flex justify-between items-center mb-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-move p-2 hover:bg-gray-100 rounded">
                              <Tooltip title="Drag to reorder">
                                <DragOutlined className="text-gray-400" />
                              </Tooltip>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                Question {questionIndex + 1}
                              </span>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeQuestion(questionIndex)}
                              />
                            </div>
                          </div>

                          <Input.TextArea
                            placeholder="Enter question"
                            value={question.question}
                            onChange={(e) =>
                              updateQuestion(questionIndex, 'question', e.target.value)
                            }
                            className="mb-4"
                            autoSize={{ minRows: 2 }}
                          />

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              {question.options.map((option, optionIndex) => (
                                <Input
                                  key={optionIndex}
                                  placeholder={`Option ${optionIndex + 1}`}
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(questionIndex, optionIndex, e.target.value)
                                  }
                                  className={`transition-all ${
                                    option === question.correctAnswer
                                      ? 'border-green-500 ring-1 ring-green-500'
                                      : ''
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="mt-4">
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                Select Correct Answer:
                              </div>
                              <Radio.Group
                                value={question.correctAnswer}
                                onChange={(e) =>
                                  updateQuestion(questionIndex, 'correctAnswer', e.target.value)
                                }
                                className="w-full">
                                <Space
                                  direction="vertical"
                                  className="w-full">
                                  {question.options.map((option, optionIndex) => (
                                    <Radio
                                      key={optionIndex}
                                      value={option}
                                      disabled={!option.trim()}
                                      className="w-full p-2 hover:bg-gray-50 rounded">
                                      {option || `Option ${optionIndex + 1} (empty)`}
                                    </Radio>
                                  ))}
                                </Space>
                              </Radio.Group>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
            type="dashed"
            onClick={addQuestion}
            className="w-full mt-4"
            icon={<PlusOutlined />}>
            Add Question ({questions.length}/6)
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default NewMcq;
