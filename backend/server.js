require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const initSocket = require('./src/sockets/socket');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  const io = initSocket(httpServer);

  // Make io available to route handlers via req.app.get('io')
  app.set('io', io);

  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();
