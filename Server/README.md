# MCQ Application Server

A backend server for an MCQ (Multiple Choice Questions) application that allows admins to schedule and publish quizzes, and users to participate in them.

## Features

### Admin Features
- Create and schedule MCQ quizzes with multiple questions
- Set publication date for quizzes
- Automatic quiz publication at scheduled date
- View quiz statistics and user performance

### User Features
- View available quizzes
- Take quizzes with one question displayed at a time
- Navigate through questions using next button
- Get immediate feedback on quiz completion
- View personal performance history
- Access leaderboard based on scores and completion time

### Quiz Mechanics
- Each quiz contains 6 questions
- Questions are displayed one at a time
- Users must answer all questions correctly to win
- Time tracking for each quiz attempt
- Leaderboard ranking based on:
  - Score (primary)
  - Completion time (secondary for tie-breaking)

### Feedback System
- "Better luck next time" message for incorrect answers
- "Hurray you won" message for perfect scores
- Performance tracking and history

## Technical Stack

- Node.js
- Express.js
- MongoDB (for data storage)
- JWT (for authentication)

## API Endpoints

### Admin Routes
- POST /api/mcq/create-set - Create new MCQ set
- PUT /api/mcq/update-set/:id - Update MCQ set
- DELETE /api/mcq/delete-set/:id - Delete MCQ set

### User Routes
- GET /api/mcq/question/:index - Get question by index
- POST /api/mcq/submit-answer - Submit answer
- GET /api/mcq/leaderboard - Get leaderboard
- GET /api/mcq/all - Get all MCQs

### Authentication Routes
- POST /api/user/register - Register new user
- POST /api/user/login - Login user
- GET /api/user/logout - Logout user
- GET /api/user/me - Get user profile
- PUT /api/user/update - Update user profile

## Data Models

### Quiz
```javascript
{
  title: String,
  description: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  publishDate: Date,
  isPublished: Boolean
}
```

### UserAttempt
```javascript
{
  userId: ObjectId,
  quizId: ObjectId,
  score: Number,
  timeTaken: Number,
  answers: [Number],
  completedAt: Date
}
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file with required environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   pnpm start
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 5000)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 