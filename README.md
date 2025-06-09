# Project Name
ecommerce backend

## Description
This project uses MongoDB for data storage and JWT for authentication. It connects to a local MongoDB instance and uses a JWT secret key for token generation and verification.

## Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:

MONGO_URL=mongodb://localhost:27017/ecom
JWT_SECRET=2c7be41d7613823ba26804857e97b9a112c9ec88ee2480297e2562ec0f423b2a5346cecaecf482f844d7ff5b74f5ce581cde63ac29bcc07143db29a493cfa255

- `MONGO_URL`: The connection string for your MongoDB database.  
- `JWT_SECRET`: The secret key used to sign and verify JSON Web Tokens for authentication.

## Requirements

- Node.js (version 14 or above recommended)  
- MongoDB running locally on default port 27017 or update `MONGO_URL` accordingly  
- npm package manager  to install dependencies

## Getting Started

1. Clone the repository:
   git clone <repository_url>
   cd <repository_folder>

2. Install dependencies:
   npm install

3. Create a `.env` file and add the environment variables as described above.

4. Start your MongoDB server locally:
   mongod

5. Run the project:
   npm start
