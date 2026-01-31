import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import http from 'http';

import { handleError } from './utils/error';
import httpLogger from './middlewares/httpLogger';
import router from './routes';
import { startHealthCheckJob } from './jobs/healthCheckJob';

const app = express();

app.use(cors());
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

startHealthCheckJob();

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = config.port;
app.set('port', port);

const server = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
