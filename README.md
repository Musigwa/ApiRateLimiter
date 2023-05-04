# API Rate Limiter

This project is an API rate limiter for SMS and email, built using Node.js and Express.

## Table of Contents

- [API Rate Limiter](#api-rate-limiter)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [API endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [API rate limiting](#api-rate-limiting)
  - [Technologies Used](#technologies-used)
  - [Contact the author](#contact-the-author)
  - [Contributing](#contributing)
  - [License](#license)

## Prerequisites

Before installing and running this project, make sure you have the following:

- Node.js (version 14 or later) and npm installed on your machine. You can download them from the [official website](https://nodejs.org).
- Yarn package manager. You can install it by following the instructions on the [official website](https://yarnpkg.com).
- MongoDB and Redis installed on your machine or on a remote server. You can download and install them from their respective [official websites](https://www.mongodb.com/try/download/community) and [official website](https://redis.io/download) respectively.

Please note that this project uses specific versions of Node.js and other dependencies. The required version of Node.js is specified in the `engines` field of the `package.json` file as shown below.

```json
{
  "name": "sms-email-rate-limiter",
  "version": "1.0.0",
  "description": "API rate limiter for SMS and email",
  ...
  "engines": {
    "node": ">=14 <19"
  },
  ...
}
```

## Installation

To install the project, you can either fork the [GitHub repository](https://github.com/Musigwa/ApiRateLimiter.git) or download the codebase, navigate to the project directory on your machine and run the following command to install the project dependencies:

```
yarn
```

After installing the dependencies, you need to create the `.env` file out of the `.env.example` template. Make sure to edit the `.env` file with the correct variables. The project uses MongoDB and Redis for the databases, so make sure you have them installed on your machine. You also need to create accounts for SendGrid and Twilio and grab the access keys/account details to your `.env` file.

## Usage

To start the service locally, run the following command:

```
yarn dev
```

This will start the server in development mode. The API endpoints will be available at `http://localhost:3000`.

The API rate limiter middleware is enabled by default for all routes, limiting the number of requests each user can make per day, based on their IP address. To purchase additional requests, users can make a `POST` request to `/services/purchase-requests`, providing their user ID and the number of requests they want to purchase.

## Testing

To run the unit and integration tests, run the following command:

```
yarn test
```

This will run all the tests and show you the results.

## Deployment

To deploy the code to production, you first need to compile the code to ES5 by running the following command:

```
yarn build
```

This will generate the `build/` directory as the code artifact. You can then deploy this directory to the cloud provider of your choice and run the following command to start the service in production mode:

```
yarn start
```

Make sure you have configured the `.env` variables as well as all the necessary databases to run the app in the production environment.

## API endpoints

1. `POST /auth/signup` - Sign up a user with their name, email and password
2. `POST /auth/login` - Login a user with their email and password and receive a JWT token.

3. `GET /auth/refresh-token` - Refresh an expired token.

4. `GET /auth/logout` - Log out / invalidated the access token

5. `POST /services/sms` - Send an SMS message to a phone number, requires a valid JWT token.

6. `POST /services/email` - Send an email message to an email address, requires a valid JWT token.

7. `POST /services/purchase-requests` - Send a purchase request to request additional requests.

## Authentication

The API uses JWT tokens for authentication.
When a user logs in or signs up, a JWT token is returned which must be included in the Authorization header for any requests that require authentication.
To refresh an expired token, send a request to the `/auth/refresh-token` endpoint with a valid refresh token.
Tokens can be invalidated by sending a request to the `/auth/logout` endpoint with a valid token.

## API rate limiting

The API includes a rate limiter middleware to limit the number of requests a user can make per minute.
Users can purchase additional requests once they have exhausted their monthly quota.

## Technologies Used

The following technologies were used to build this project:

- Node.js
- Express
- MongoDB
- Redis
- SendGrid
- Twilio
- Jest
- Babel

## Contact the author

You can contact me by: 
1. Email: pacifique.musigwa@gmail.com
2. Twitter: https://twitter.com/MusigwaP
3. LinkedIn: https://linkedin.com/in/musigwa-pacifique

## Contributing

Contributions to the project are welcome. To contribute, please fork the repository, make your changes and submit a pull request.

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).