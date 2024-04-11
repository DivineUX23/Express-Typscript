# Express-TypeScript (AI-powered social media)

This project presents a RESTful API for a simple social media platform, augmented by an AI that can optionally improve user posts. It is a Node.js application utilizing Express and TypeScript to offer a RESTful API for user authentication, post management, and other features. The application uses MongoDB for data storage, Redis for caching, and incorporates Google's Gemini AI to enhance posts.

## Table of Contents

- [Key Features](#key-features)
- [File Structure](#file-structure)
  - [Controllers](#controllers)
  - [Database](#database)
  - [Helpers](#helpers)
  - [Middlewares](#middlewares)
  - [Routers](#routers)
- [Google Gemini AI Integration](#google-gemini-AI-Integration)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Usage](#usage)



## Key Features

- **User Authentication**: Register and log in users with email and password.
- **Post Management**: Create, read, update, and delete posts with support for text, images, and videos.
- **Google Gemini AI Integration**: Optionally rewrite post content using Google's Gemini AI language model.
- **User Interactions**: Follow other users, like and comment on posts, and receive notifications.
- **Pagination and Caching**: Retrieve data with pagination support and caching for improved performance.
- **Socket.IO Integration**: Real-time notifications and updates.

The application follows a modular structure with separate folders for controllers, database models, middlewares, and routes. TypeScript is used for type safety and better tooling support.



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



## Google Gemini AI Integration

This project integrates with the Google Gemini AI model to provide an optional text rewrite feature for creating new posts. The Gemini AI model can be used to enhance or rephrase the content of a post before it is created, allowing users to generate more engaging and lively content.

### Usage

To create a new post with the optional Gemini AI rewrite, send a POST request to the `/posts/new` endpoint with the following request body:

#### Create a new post (with optional Gemini AI rewrite)

**Route:** POST /posts/new

**Body:**

```json
{
  "post": "This is my post.",
  "edit": "Make it lively", : Calling Gemini AI rewrite
  "imageUrl": null,
  "videoUrl": null
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "user": "637984729847298472984729",
  "post": "Super excited to share this post with you!", : Post after Gemini AI rewrite
  "imageUrl": null,
  "videoUrl": null,
  "createdAt": "2023-08-09T18:30:00.000Z",
  "likes": [],
  "comments": []
}
```

If the `edit` field is provided in the request body, the Gemini AI model will be used to rephrase or enhance the post content according to the specified instructions. If the `edit` field is not provided, the post will be created without any AI rewrite.




## API Documentation

### Authentication

#### Login with an existing user account.

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

#### Register a new user account

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

#### Retrieve a list of all posts (paginated)

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

#### Retrieve a single post by ID

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

#### Create a new post (with optional Gemini AI rewrite)

**Route:** POST /posts/new

**Body:**

```json
{
  "post": "This is my post.",
  "edit": "Make it lively" :calling gemini AI rewrite
  "imageUrl": null,
  "videoUrl": null
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "user": "637984729847298472984729",
  "post": "Super excited to share this post with you!", :post after gemini AI rewrite
  "imageUrl": null,
  "videoUrl": null,
  "createdAt": "2023-08-09T18:30:00.000Z",
  "likes": [],
  "comments": []
}
```

#### Delete a post by ID

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

#### Update a post by ID (with optional content and media updates)

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

#### Retrieve posts by a specific user (paginated)

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

#### Retrieve posts from followed users (paginated)

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

#### Comment on a post

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

#### Like or unlike a post

**Route:** POST /posts/likes/:id

**Parameters:**

- `id`: The ID of the post

**Response:**

```json
[
  "637984729847298472984729"
]
```

#### Create a mention notification for a post

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

#### Retrieve a list of all users (paginated)

**Route:** GET /users

**Query Parameters:**

- `page`: The page number (default: 1)
- `limit`: The number of users per page (default: 10)

**Response:**

```json
{
  "users": [
    {
      "_id": "637984729847298472984729",
      "username": "John Doe",
      "email": "user@example.com",
      "authentication": {
        "password": "sdfsdfsdfsdf",
        "salt": "sdfsdfsdfsdf"
      },
      "following": [],
      "followers": []
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

#### Delete a user by ID

**Route:** DELETE /users/:id

**Parameters:**

- `id`: The ID of the user

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "username": "John Doe",
  "email": "user@example.com",
  "authentication": {
    "password": "sdfsdfsdfsdf",
    "salt": "sdfsdfsdfsdf"
  },
  "following": [],
  "followers": []
}
```

#### Update a user by ID

**Route:** PATCH /users/:id

**Body:**

```json
{
  "username": "Jane Doe"
}
```

**Response:**

```json
{
  "_id": "637984729847298472984729",
  "username": "Jane Doe",
  "email": "user@example.com",
  "authentication": {
    "password": "sdfsdfsdfsdf",
    "salt": "sdfsdfsdfsdf"
  },
  "following": [],
  "followers": []
}
```

#### Follow another user by ID

**Route:** POST /follow/:id

**Parameters:**

- `id`: The ID of the user to follow

**Response:**

```json
{
  "following": [
    "637984729847298472984729"
  ]
}
```



## Installation

1. Clone the repository:

```
git clone https://github.com/your-username/express-typescript-project.git
```

2. Navigate to the project directory:

```
cd express-typescript-project
```

3. Install the dependencies:

```
npm install
```

4. Create a `.env` file in the root directory and add the following environment variables:

```
MONGO_URL=<your-mongodb-url> : The MongoDB connection URL.
REDIS_URL=<your-redis-url> : The API key for Google's Generative AI (Gemini).
GEMINI_API_KEY=<your-gemini-api-key> : The Redis URL for caching.
```

## Usage

1. Start the development server:

```npm start
```

The server will start running at `http://localhost:8080`.

2. Use an API client like Postman or cURL to interact with the available endpoints.


