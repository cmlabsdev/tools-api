const redis = require('redis');

const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

redisClient = {};

redisClient.keywordLists = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS,
    db: 0
});

redisClient.taskLists = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASS,
    db: 1
})

module.exports = redisClient;