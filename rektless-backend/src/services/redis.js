"use strict";

const redis = require('redis');
const { promisifyAll } = require('bluebird');
const { redisConnectionString } = require('../appArguments').getAppArguments();

promisifyAll(redis);

let client;

const init = async() => {
    client = redis.createClient(redisConnectionString);
    return true;
}

const getAsync = async (key) => {
    return await client.getAsync(key);
}

const setAsync = async (key, value) => {
    return await client.setAsync(key, value);
}

const delAsync = async (key) => {
    return await client.delAsync(key);
}

const keysAsync = async (filter) => {
    return await client.keysAsync(filter);
}


module.exports = {
    init,
    getAsync,
    setAsync,
    delAsync,
    keysAsync
}
