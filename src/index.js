import swaggerUi from 'swagger-ui-express';
import app from './app';
import { closeDbConnection } from 'configs/databases';
import swaggerDocs from 'documentation';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Handle some necessary operations before the server shutdown
process.on('SIGINT', closeDbConnection);

const { SERVER_PORT = 3000 } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port: ${SERVER_PORT}`);
});
