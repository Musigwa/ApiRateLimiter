import express from "express";
import swaggerUi from 'swagger-ui-express';
import { handleSendEmail, handleSendSMS } from './controllers';
import swaggerDocs from './documentation';
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: '404: Page not found' });
});

// Handle all other errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: '500: Internal server error' });
});

// Dummy endpoint for signup requests
app.post('/users/signup', (req, res) => {
  console.log('req.body', req.body);
  res.status(201).json(req.body);
});

// Dummy endpoint for login requests
app.post('/users/login', (req, res) => {
  console.log('req.body', req.body);
  res.status(200).json(req.body);
});

app.post('/sms', handleSendSMS);
app.post('/email', handleSendEmail);

const { SERVER_PORT = 3000 } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port: ${SERVER_PORT}`);
});
