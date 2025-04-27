export default () => ({
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        // password: process.env.REDIS_PASSWORD,
    },
    mongodb: {
        url: process.env.MONGODB_URL,
    },
 
});