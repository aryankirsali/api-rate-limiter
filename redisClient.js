// redisClient.js
const redis = require('redis');
const { promisify } = require('util');
const logger = require('./logger');

const redisClient = redis.createClient({
  host: '6379-aryankirsal-apiratelimi-h2oyd31qdhy.ws-us114.gitpod.io', // Localhost
  port: 6379, // Default Redis port
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('error', (err) => {
  logger.error('Redis error', err);
});

// Promisify Redis methods
const incrAsync = promisify(redisClient.incr).bind(redisClient);
const expireAtAsync = promisify(redisClient.expireAt).bind(redisClient);

module.exports = {
  redisClient,
  incrAsync,
  expireAtAsync,
};