# REST-API---Blog
This project is a Node.js backend application that provides a REST API for managing resources. 
It includes routes for handling CRUD (Create, Read, Update, Delete) operations on various resources. 
The application is built using Node.js and uses Express.js as the web framework. The data is stored in a MongoDB database.

## Features

- RESTful API: The backend provides a RESTful API for interacting with the resources
- User Signup and Login: Users can sign up with a unique email address and password, and then log in to access the platform.
- User Authentication: Authenticated users can perform CRUD operations on blog posts and update their status.
- Real-time Updates: WebSocket integration allows real-time updates when a new post is created or an existing post is updated or deleted.
- File Upload: Users can upload images for their blog posts, and the platform stores them securely.
- MongoDB Database: The project utilizes MongoDB as the database to store user and post data.

## Installation and Setup

1. Clone the repository: git clone https://github.com/7AkhilV/REST-API---Blog.git
2. Install dependencies: npm install
3. Set up environment variables:
Create a `.env` file in the root directory and set any necessary environment variables, such as:
MONGODB_URI
PORT
JWT_TOKEN
4. Start the server: 
The server will be running at `http://localhost:8080`.

## API Endpoints

The API provides endpoints for interacting with different resources. Here are some example endpoints:

- `GET /api/posts`: Get a list of all posts.
- `POST /api/posts`: Create a new post.
- `GET /api/posts/:postId`: Get a specific post by ID.
- `PUT /api/posts/:postId`: Update a post by ID.
- `DELETE /api/posts/:postId`: Delete a post by ID.

Modify the routes and controllers as needed to fit your application's specific requirements.
## Technologies Used

- Express.js: Web framework for building the server-side application.
- MongoDB: NoSQL database for storing user and post data.
- Socket.IO: Library for enabling real-time, bidirectional communication between clients and the server.
- Multer: Middleware for handling file uploads.
  
