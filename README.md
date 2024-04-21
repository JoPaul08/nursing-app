Nursing Web App Backend
The backend of the Nursing Web App is designed to support the frontend by providing a GraphQL API for efficiently managing data related to nurse practitioners and patient monitoring. This server handles authentication, database operations, and schema validations necessary for operating the healthcare monitoring system effectively.

Features
GraphQL API: Implements a GraphQL server with Express.js to handle queries and mutations more efficiently than traditional REST APIs. This allows for retrieving and manipulating specific subsets of data according to client needs.

Technologies
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine for building fast network applications.
Express.js: Minimalist web framework for Node.js, used here to run the GraphQL server.
GraphQL: A query language for your API, and a server-side runtime for executing queries using a type system you define for your data.
MongoDB: A document-based NoSQL database used to store application data in a scalable fashion.
Mongoose: An object data modeling (ODM) library for MongoDB and Node.js that provides schema validation and enhances database interaction.

Getting Started
Follow these instructions to set up the backend server on your local development machine.

Prerequisites
Node.js and npm: Download and install Node.js, npm is included.
MongoDB: Install MongoDB and make sure it's running on your system.
Installation
Clone the repository and install dependencies:

bash
Copy code
git clone https://github.com/JoPaul08/nursing-web-app-backend.git
cd nursing-web-app-backend
npm install

Configuring the Environment
Create a .env file in the project root to store environment variables:

PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Running the Server
Start the server with:
npm start

This will launch the GraphQL server on http://localhost:4000/graphql, where you can interact with the API through GraphQL queries and mutations.

