const express = require('express');
const http = require('http');
const userRoutes = require('./routes/user');
const usageRoutes = require('./routes/usage');
const rateLimiter = require('./middleware/rateLimiter');
const logger = require('./logger');
require('./scheduler');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', rateLimiter, usageRoutes);

server.listen(3000, () => {
    logger.info('Server running on port 3000');
});