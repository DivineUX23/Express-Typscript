# Express-TypeScript
 A RESTful API for a basic social media platform powered by an AI that optionally enhances users' posts.
 
This Express-based server application is built with TypeScript, designed to handle various functionalities such as user authentication, post creation and management, and real-time notifications using Socket.IO.


## Table of Contents

- [File Structure](#file-structure)
  - [Controllers](#controllers)
  - [Database](#database)
  - [Helpers](#helpers)
  - [Middlewares](#middlewares)
  - [Routers](#routers)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Usage](#usage)


## File Structure

```
.
├── controllers/
│   ├── Authentication.ts
│   ├── Gemini.ts
│   ├── Posts.ts
│   └── Users.ts
├── db/
│   ├── notifications.ts
│   ├── Post.ts
│   └── Users.ts
├── helpers/
│   └── Index.ts
├── middlewares/
│   ├── Caching.ts
│   ├── Index.ts
│   ├── notifications.ts
│   ├── paginations.ts
│   └── uploads.ts
├── router/
│   ├── authentications.ts
│   ├── Index.ts
│   ├── Posts.ts
│   └── users.ts
├── index.ts
├── package.json
└── README.md
```

### Controllers

- `Authentication.ts`: Handles user registration and login.
- `Gemini.ts`: Integrates with Google's Gemini AI for text generation and editing.
- `Posts.ts`: Manages post-related operations, including creating, updating, deleting, and retrieving posts, as well as handling comments, likes, and mentions.
- `Users.ts`: Handles user-related operations, such as retrieving, updating, deleting, and following users.

### Database

- `notifications.ts`: Defines the Notification model and provides helper functions for retrieving notifications.
- `Post.ts`: Defines the Post model and provides helper functions for managing posts.
- `Users.ts`: Defines the User model and provides helper functions for managing users.

### Helpers

- `Index.ts`: Contains utility functions for random string generation and authentication hashing.

### Middlewares

- `Caching.ts`: Implements caching middleware for efficient data retrieval.
- `Index.ts`: Contains middleware functions for authentication, ownership checks, and post-ownership checks.
- `notifications.ts`: Handles real-time notifications using Socket.IO.
- `paginations.ts`: Implements pagination middleware for database queries.
- `uploads.ts`: Configures file upload handling using Multer.

### Routers

- `authentications.ts`: Defines routes for user authentication (registration and login).
- `Index.ts`: Initializes and configures all routes.
- `Posts.ts`: Defines routes for post-related operations.
- `users.ts`: Defines routes for user-related operations.

### Root File

- `index.ts`: Entry point of the application, responsible for setting up the server, connecting to the database, and configuring middleware and routes.


## Environment Variables

Make sure to create a `.env` file in the root directory and provide the following environment variables:

- `MONGO_URL`: The MongoDB connection URL.
- `GEMINI_API_KEY`: The API key for Google's Generative AI (Gemini).
- `REDIS_URL`: The Redis URL for caching.



## API Documentation
## API Documentation

### Authentication

#### Login

**Route:** POST /auth/login

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "username": "John Doe",
  "email": "user@example.com",
  "authentication": {
    "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzM3OTQ3Mjk4NDcyOTg0NzI5ODQ3MjkifQ.sdfsdfsdfsdf"
  }
}
```

#### Register

**Route:** POST /auth/register

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password",
  "username": "John Doe"
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "username": "John Doe",
  "email": "user@example.com",
  "authentication": {
    "salt": "sdfsdfsdfsdf",
    "password": "sdfsdfsdfsdf"
  }
}
```

### Posts

#### Get All Posts

**Route:** GET /posts

**Query Parameters:**

- `page`: The page number (default: 1)
- `limit`: The number of posts per page (default: 10)

**Response:**

```json
{
  "posts": [
    {
      "_id": "637984729847298472984729",
      "user": "637984729847298472984729",
      "post": "This is a post.",
      "imageUrl": null,
      "videoUrl": null,
      "createdAt": "2023-08-09T18:30:00.000Z",
      "likes": [],
      "comments": []
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

#### Get Post by ID

**Route:** GET /posts/:id

**Parameters:**

- `id`: The ID of the post

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "user": "637984729847298472984729",
  "post": "This is a post.",
  "imageUrl": null,
  "videoUrl": null,
  "createdAt": "2023-08-09T18:30:00.000Z",
  "likes": [],
  "comments": []
}
```

#### Create Post

**Route:** POST /posts/new

**Body:**

```json
{
  "post": "This is a post.",
  "imageUrl": null,
  "videoUrl": null
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "user": "637984729847298472984729",
  "post": "This is a post.",
  "imageUrl": null,
  "videoUrl": null,
  "createdAt": "2023-08-09T18:30:00.000Z",
  "likes": [],
  "comments": []
}
```

#### Delete Post

**Route:** DELETE /posts/:id

**Parameters:**

- `id`: The ID of the post

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "user": "637984729847298472984729",
  "post": "This is a post.",
  "imageUrl": null,
  "videoUrl": null,
  "createdAt": "2023-08-09T18:30:00.000Z",
  "likes": [],
  "comments": []
}
```

#### Update Post

**Route:** PATCH /posts/:id

**Body:**

```json
{
  "post": "This is an updated post."
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "user": "637984729847298472984729",
  "post": "This is an updated post.",
  "imageUrl": null,
  "videoUrl": null,
  "createdAt": "2023-08-09T18:30:00.000Z",
  "likes": [],
  "comments": []
}
```

#### Get Posts by User

**Route:** GET /posts/user/:id

**Parameters:**

- `id`: The ID of the user

**Response:**

```json
{
  "posts": [
    {
      "_id": "637984729847298472984729",
      "user": "637984729847298472984729",
      "post": "This is a post.",
      "imageUrl": null,
      "videoUrl": null,
      "createdAt": "2023-08-09T18:30:00.000Z",
      "likes": [],
      "comments": []
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

#### Get Posts from Followed Users

**Route:** GET /post/following

**Response:**

```json
{
  "posts": [
    {
      "_id": "637984729847298472984729",
      "user": "637984729847298472984729",
      "post": "This is a post.",
      "imageUrl": null,
      "videoUrl": null,
      "createdAt": "2023-08-09T18:30:00.000Z",
      "likes": [],
      "comments": []
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

#### Comment on Post

**Route:** POST /posts/comment/:id

**Parameters:**

- `id`: The ID of the post

**Body:**

```json
{
  "comment": "This is a comment."
}
```

**Response:**

```json
[
  {
    "user": "637984729847298472984729",
    "comments": "This is a comment."
  }
]
```

#### Like Post

**Route:** POST /posts/likes/:id

**Parameters:**

- `id`: The ID of the post

**Response:**

```json
[
  "637984729847298472984729"
]
```

#### Mention Users in Post

**Route:** POST /posts/mentions

**Body:**

```json
{
  "userId": "637984729847298472984729",
  "post": "This is a post that mentions @username."
}
```

**Response:**

```json
{
  "post": "This is a post that mentions @username."
}
```

### Users

#### Get All Users

**Route:** GET /users


## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/express-typescript-project.git
```

2. Navigate to the project directory:

```bash
cd express-typescript-project
```

3. Install the dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory and add the following environment variables:

```
MONGO_URL=<your-mongodb-url>
REDIS_URL=<your-redis-url>
GEMINI_API_KEY=<your-gemini-api-key>
```

## Usage

1. Start the development server:

```bash
npm run dev
```

The server will start running at `http://localhost:8080`.

2. Use an API client like Postman or cURL to interact with the available endpoints.
