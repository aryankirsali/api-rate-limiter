const { incrAsync, expireAtAsync } = require('../redisClient');
const { ApiUsage } = require('../db');
const logger = require('../logger');

const rateLimiter = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        logger.warn('API key is missing');
        return res.status(401).send('API Key is missing');
    }

    try {
        const usage = await ApiUsage.findOne({ apiKey });
        if (!usage) {
            logger.warn('Invalid API Key');
            return res.status(401).send('Invalid API Key');
        }

        const count = await incrAsync(apiKey);
        if (count === 1) {
            await expireAtAsync(apiKey, Math.floor(usage.resetAt.getTime() / 1000));
        }

        if (count > 10) { // Limit to 10 requests per hour
            logger.warn(`Rate limit exceeded for API Key: ${apiKey}`);
            return res.status(429).send('Rate limit exceeded');
        }

        next();
    } catch (err) {
        logger.error('Rate limiting error', err);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = rateLimiter;
