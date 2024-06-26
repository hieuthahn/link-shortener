import mongoose from 'mongoose';
import config from './config/config';
import app from './app';

let server: any;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  console.log(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close(() => {
      console.log('SIGTERM received: server closed');
    });
  }
});
