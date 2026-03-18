# ICC-API-Coding-Challenge
This is an API with two endpoints. The first endpoint asks for user-provided information that then gets attached to a randomly generated one-time use token. This token can then be used by the second endpoint to access the information that was provided to the first endpoint. Tokens can only be used once, and they will automatically expire after 24-hours.

# Project Structure
```
ICC API Coding Challenge
│
├── docs/                     # Static API documentation site
│   │
│   ├── api/                  # API documentation pages
│   ├── css/                  # Documentation css
│   └── index.html            # Documentation homepage
│
├── node_modules/             # Installed npm dependencies (not here by default, read below).
│
├── src/                      # Application source code
│   │
│   ├── helpers/              # Helper functions
│   ├── models/               # MongooseDB schemas
│   ├── routes/               # Express API route definitions
│
├── tests/                    # Unit tests
│
├── .gitignore               
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Dependency lockfile
├── README.md                 # Project startup information
└── server.js                 # Express server entry point
```
# Requirements
1. Node.js (v. 16 or higher)
2. MongoDB
3. npm
# Installation
Clone the repository:
```
git clone https://github.com/TermSpar/ICC-API-Coding-Challenge.git
cd ICC-API-Coding-Challenge
```
Install dependencies:
```
npm install
```
# Environment Variables (Optional)
If you would like to override the sever and database connection variables (e.g. DB_HOST, SERVER_HOST, etc.)
you can do so in your own `.env` file. Otherwise, these default values will be used:
```
| Variable      | Default Value      | Description                            |
|---------------|--------------------|----------------------------------------|
| DB_HOST       | localhost          | MongoDB host                           |
| DB_NAME       | bollinger-test     | MongoDB database name                  |
| SERVER_HOST   | localhost          | Host for Express server                |
| SERVER_PORT   | 3000               | Port for Express server                |
```
# Running the API
**Start the server**:
```
npm start
```
Alternatively for nodemon:
```
npm run devStart
```
The API will start on:
```
http://SERVER_HOST:SERVER_PORT
```
**The API requires a running MongoDB instance**. Follow the [instructions](https://www.mongodb.com/docs/mongodb-shell/install/?operating-system=windows&windows-installation-method=msiexec&utm_campaign=w3schools_mdb&utm_medium=referral&utm_source=w3schools) for starting MongoDB on your operating system.  
  
Once both the server and the database are running, the following output will be given (default variables are used in this example):
```
Server started on http://localhost:3000
Connected to Database: bollinger-test at localhost
```
# Using the API Endpoints
Once the server is running and connected to the database, you can use the API through a service such as [Postman](https://www.postman.com/downloads/).  
  
First, you will want to create a `Message` via a POST request to `http://SERVER_HOST:SERVER_PORT/message`. It should contain string data for the `name`, `email`, and `message` fields. For example:  
  
**POST** `http://localhost:3000/message`  
Request Body (JSON)
```
{
    "name": "Ben Bollinger",
    "email": "benbollinger@test.com",
    "message": "This is Ben's message!"
}
```
Response (201 Created)  
```
{
    "success": true,
    "error": null,
    "token": "actual-generated-token-string"
}
```
**Make sure you save the token.** Since it will be stored as a hashed string in the database,
there will be no other way to access this token once the response message is gone.  
  
Once you have your token, you can retrieve all of the data attached to your message via a GET request to `http://SERVER_HOST:SERVER_PORT/message/:token`. For example:  
  
**GET** `http://localhost:3000/message/actual-generated-token-string`  
  
Response (200 OK)  
```
{
    "success": true,
    "error": null,
    "name": "Ben Bollinger",
    "email": "benbollinger@test.com",
    "message": "This is Ben's message!"
}
```
**Note:** this token "link" can only be used once. If you attempt to make another GET request, you will receive the following error:  
  
Response (400 Bad Request)
```
{
    "success": false,
    "error": "This link has already been used.",
    "name": null,
    "email": null,
    "message": null
}
```
# Documentation
Full documentation is available on **Github Pages**:

https://termspar.github.io/ICC-API-Coding-Challenge/index.html

It can also be viewed locally by opening the following in your browser:
```
docs/index.html
```
