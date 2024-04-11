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

### Authentication

- `POST /auth/register`: Register a new user account.
- `POST /auth/login`: Log in with an existing user account.

### Users

- `GET /users`: Retrieve a list of all users (paginated).
- `DELETE /users/:id`: Delete a user by ID.
- `PATCH /users/:id`: Update a user's username by ID.
- `POST /follow/:id`: Follow another user by ID.

### Posts

- `GET /posts`: Retrieve a list of all posts (paginated).
- `GET /posts/:id`: Retrieve a single post by ID.
- `POST /posts/new`: Create a new post (with optional Gemini AI rewrite).
- `DELETE /posts/:id`: Delete a post by ID.
- `PATCH /posts/:id`: Update a post by ID (with optional content and media updates).
- `GET /posts/user/:id`: Retrieve posts by a specific user (paginated).
- `GET /post/following`: Retrieve posts from followed users (paginated).
- `POST /posts/comment/:id`: Comment on a post.
- `POST /posts/likes/:id`: Like or unlike a post.
- `POST /posts/mentions`: Create a mention notification for a post.



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
