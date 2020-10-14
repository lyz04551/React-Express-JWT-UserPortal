const jwt_config = {
    accessTokenSecret: 't',
    refreshTokenSecret: 'e',
    saltRounds: 10,
    jwt_timeout: '20m'
}
module.exports = jwt_config
