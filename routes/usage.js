const express = require('express');
const { ApiUsage } = require('../db');
const logger = require('../logger');
const router = express.Router();

router.get('/usage', async (req, res) => {
    try {
        const usages = await ApiUsage.find();
        res.send(usages);
    } catch (err) {
        logger.error('Error fetching usage data', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/usages/:apiKey', async (req, res) => {
    try {
        const usage = await ApiUsage.findOne({
            apiKey: req.params.apiKey
        });
        if (!usage) {
            logger.warn(`Api key not found: ${req.params.apiKey}`);
            return res.status(404).send('API key not found');
        }
        res.send(usage);
    } catch (err) {
        logger.error(`Error fetching usage data for API Key: ${req.params.apiKey}`);
        req.status(500).send('Internal Server Error');
    }
})

module.exports = router;