const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User, ApiUsage } = require('../db');
const logger = require('../logger');
const router = express.Router();

// Register User
router.post('/users', async(req, res) => {
    try{
        const apiKey = uuidv4();
        const user = new User({ ...req.body, apiKey});
        await user.save();

        const usage = new ApiUsage({apiKey, resetAt: new Date(Date.now() + 60 * 60 * 1000)}); // 1 hour limit
        await usage.save();

        res.status(201).send({ apiKey });
    }catch(err){
        logger.error('Error creating user', err);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch all users
router.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      logger.error('Error fetching users', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;