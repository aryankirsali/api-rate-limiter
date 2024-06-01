const redisClient = require('./redisClient');
const { ApiUsage } = require('../db');
const logger = require('../logger');

const rateLimiter = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        logger.warn('API key is missing');
        return res.status(401).send('API Key is missing');
    }

    try {
        const usage = await ApiUsage.findOne({
            apiKey,
        });
        if (!usage) {
            logger.warn('Invalid API Key');
            res.status(401).send('Invalid API Key');
        }
        redisClient.incr(apiKey, async (err, count) => {
            if (err) {
                logger.error('Redis error', err);
                res.status(500).send('Redis error');
            }

            if (count == 1) {
                redisClient.expireat(apiKey, Math.floor(usage.resetAt.getTime() / 1000));
            }

            if (count > 10) { // Limit to 10 requests per hour
                logger.warn(`Rate limit exceeded for API Key: ${apiKey}`);
                res.status(429).send('Rate limit exceeded');
            }

            next();
        });
    } catch (err) {
        logger.error('Rate limiting error', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = rateLimiter;