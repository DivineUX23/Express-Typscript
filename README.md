# Express-Typscript
 A RESTful API for a basic social media platform powered by AI to help users write post (optional enhances users post based on they're demand) to help them communicate better. The API will facilitate user interactions and data management within the platform.

This is a Node.js project built with Express and TypeScript, providing a RESTful API and real-time notifications using Socket.IO.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
  - [Controllers](#controllers)
  - [Database](#database)
  - [Helpers](#helpers)
  - [Middlewares](#middlewares)
  - [Routers](#routers)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/express-typescript-project.git
```

2. Install dependencies:

```bash
cd express-typescript-project
npm install
```

## Project Structure

### Controllers

- `Authentication.ts`: Handles user registration and login.
- `Gemini.ts`: Provides integration with Google's Generative AI (Gemini) for text generation.
- `Posts.ts`: Manages CRUD operations for posts, comments, likes, and mentions.
- `Users.ts`: Handles user-related operations like retrieving users, updating usernames, and following other users.

### Database

- `notifications.ts`: Defines the Notification schema and provides utility functions for working with notifications.
- `Post.ts`: Defines the Post schema and provides utility functions for working with posts.
- `Users.ts`: Defines the User schema and provides utility functions for working with users.

### Helpers

- `Index.ts`: Contains helper functions for generating random strings and hashing passwords.

### Middlewares

- `Caching.ts`: Implements caching using Redis.
- `Index.ts`: Includes middlewares for authentication, ownership checks, and checking if the current user is the owner of a post.
- `notifications.ts`: Handles real-time notifications using Socket.IO.
- `paginations.ts`: Implements pagination for database queries.
- `uploads.ts`: Configures Multer for handling file uploads.

### Routers

- `authentications.ts`: Defines routes for user authentication (registration and login).
- `Index.ts`: Initializes and combines all route configurations.
- `Posts.ts`: Defines routes for post-related operations (CRUD, comments, likes, mentions).
- `users.ts`: Defines routes for user-related operations (retrieving users, updating usernames, following other users).

## Environment Variables

Make sure to create a `.env` file in the root directory and provide the following environment variables:

- `MONGO_URL`: The MongoDB connection URL.
- `GEMINI_API_KEY`: The API key for Google's Generative AI (Gemini).
- `REDIS_URL`: The Redis URL for caching.

## Running the Project

1. Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:8080`.

2. To build the project for production:

```bash
npm run build
```

This will create a `dist` folder with the compiled JavaScript files.

3. Start the production server:

```bash
node dist/index.js
```

The production server will be running at `http://localhost:8080`.
