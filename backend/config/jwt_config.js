const jwt_config = {
    accessTokenSecret: 't',
    refreshTokenSecret: 'e',
    saltRounds: 10,
    jwt_timeout: '1m',
    corsOptions: {
        origin: "http://localhost:3000"
    }
}
module.exports = jwt_config
