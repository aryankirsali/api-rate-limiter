// scheduler.js
const cron = require('node-cron');
const Agenda = require('agenda');
const { ApiUsage } = require('./db');
const redisClient = require('./redisClient');
const logger = require('./logger');

const agenda = new Agenda({db: {address: 'mongodb+srv://aryankirsali:I%40mgreat22@api-rate-limiter.dwqvoki.mongodb.net/api-rate-limiter?retryWrites=true&w=majority'}});

agenda.define('reset usage counters', async(job) => {
    try{
        const now = new Date();
        const usages = await ApiUsage.find({resetAt: {$lte: now}});

        usages.forEach(async (usage) => {
            await ApiUsage.updateOne({apiKey: usage.apiKey}, { count: 0, resetAt: new Date(now.getTime() + 60 * 60 * 1000)});
            redisClient.del(usage.apiKey);
        });
        logger.info('Usage counters reset successfully');
    }catch(err){
        logger.error('Error resetting usage counters', err);
    }
});

(async function(){
    await agenda.start();
    agenda.every('1 hour', 'reset usage counters');
})();

cron.schedule('0 * * * *', async() => {
    await agenda.now('reset usage counters');
});