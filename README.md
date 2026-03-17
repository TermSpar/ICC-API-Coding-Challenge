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
http://localhost:3000
```
**The API requires a running MongoDB instance**. Follow the instructions for starting MongoDB on your operating system.  
  
Once both the server and the database are running, the following output will be given:
```
Server started on port 3000
Connected to Database
```
# Documentation
Full documentation is available on **Github Pages**:

https://termspar.github.io/ICC-API-Coding-Challenge/

It can also be viewed locally by opening
```
docs/index.html
```
in your browser
