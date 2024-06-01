const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://aryankirsali:I@mgreat22@api-rate-limiter.dwqvoki.mongodb.net/?retryWrites=true&w=majority&appName=api-rate-limiter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    userName: String,
    apiKey: String,
    createdAt: {type: Date, default: Date.now()},
});

const ApiUsageSchema = new mongoose.Schema({
    apiKey: String,
    count: {type: Number, default: 0},
    resetAt: Date,
});

const User = mongoose.model('User', UserSchema);
const ApiUsage = mongoose.model('ApiKey', ApiUsageSchema);

module.exports = {
    User,
    ApiUsage,
}