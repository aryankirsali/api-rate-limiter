const mongoose = require('mongoose');
const logger = require('./logger');

const mongoURI = 'mongodb+srv://aryankirsali:I%40mgreat22@api-rate-limiter.dwqvoki.mongodb.net/api-rate-limiter?retryWrites=true&w=majority';
mongoose.connect(mongoURI).then(() => {
    logger.info('MongoDB connected');
})
    .catch((err) => {
        logger.error('MongoDB connection error', err);
    });

const UserSchema = new mongoose.Schema({
    userName: String,
    apiKey: String,
    createdAt: { type: Date, default: Date.now() },
});

const ApiUsageSchema = new mongoose.Schema({
    apiKey: String,
    count: { type: Number, default: 0 },
    resetAt: Date,
});

const User = mongoose.model('User', UserSchema);
const ApiUsage = mongoose.model('ApiKey', ApiUsageSchema);

module.exports = {
    User,
    ApiUsage,
}