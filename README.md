# MCQ Application

A full-stack application for managing and participating in multiple-choice quizzes. The application includes an admin interface for creating and managing quizzes and a user interface for participating in quizzes.

## Features

- Admin can create, update, and delete MCQ sets.
- Users can participate in quizzes and submit answers.
- Leaderboard to display top scorers.
- Authentication for users and admins.
- Dark and light theme support.

## Technical Stack

- **Frontend**: React, Ant Design, Recharts
- **Backend**: Node.js, Express, MongoDB
- **State Management**: Redux
- **Authentication**: JWT
- **Styling**: Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- pnpm (v6 or higher)
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/Nitishcoderr/Crico-Game.git
cd Crico-Game
```

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the `Server` directory with the following variables:

```properties
NODE_ENV=DEVELOPMENT
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/cricoMcq
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

### Start the Server

Navigate to the `Server` directory and start the server:

```bash
cd Server
pnpm start
```

### Start the Client

Navigate to the `Client` directory and start the client:

```bash
cd Client
pnpm dev
```

## API Endpoints

### Admin Routes

- `POST /api/mcq/create-set` - Create new MCQ set
- `PUT /api/mcq/update-set/:id` - Update MCQ set
- `DELETE /api/mcq/delete-set/:id` - Delete MCQ set

### User Routes

- `GET /api/mcq/question/:index` - Get question by index
- `POST /api/mcq/submit-answer` - Submit answer
- `GET /api/mcq/leaderboard` - Get leaderboard
- `GET /api/mcq/all` - Get all MCQs

### Authentication Routes

- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/logout` - Logout user
- `GET /api/user/me` - Get user profile
- `PUT /api/user/update` - Update user profile

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

## Environment Variables

- `MONGO_URI`: MongoDB connection string
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