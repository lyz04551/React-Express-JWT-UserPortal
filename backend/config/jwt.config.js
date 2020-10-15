const jwtConfig = {
    accessTokenSecret: 't',
    refreshTokenSecret: 'e',
    saltRounds: 10,
    jwt_timeout: '20m',
    corsOptions: {
        origin: "http://localhost:3000"
    }
}
module.exports = jwtConfig
