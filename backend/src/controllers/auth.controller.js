'use strict';
const Auth = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const accessTokenSecret = "t"
const refreshTokenSecret = "e"
const refreshTokens = []
const saltRounds = 10

exports.findAll = function (req, res) {
    auth.getAll(function(err, professional) {
        console.log('controller')
        if (err) res.send(err)
        console.log('res', professional)
        res.send(professional)
    })
}
exports.create = function (req, res){
    const new_user = new Auth(req.body)

//    handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0){
        console.log(req.body)
        res.status(400).send({error: true, message: 'Please provide all required field'})
    } else {
        Auth.create(new_user, function (err, user) {
            if (err)
                res.send(err)
            res.send({error:false, message: 'User added successfully!', data: user})
        })
    }
}
// exports.findById = function (req, res) {
//     Auth.findById(req.params.id, function (err, user) {
//         if (err)
//             res.send(err)
//         res.json(user)
//     })
// }
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err)
                return res.sendStatus(403)
            req.user = user
            next()
        })
    } else
        res.sendStatus(401)
}
exports.login = (req, res) => {
    const { email, pass } = req.body

    Auth.findByEmail(email, function (err, user) {
        if (err)
            res.send(err)
        if (user.length === 0)
            res.json({
                message: "Account is not exist"
            })
        else {
            const match = bcrypt.compareSync(pass, user[0].pass)
            if (match) {
                const accessToken = jwt.sign({ username: user[0].username, role: 'admin' }, accessTokenSecret,
                    { expiresIn: '20m' })
                const refreshToken = jwt.sign({ username: user[0].username, role: 'admin' }, refreshTokenSecret)
                refreshTokens.push(refreshToken)

                res.json({
                    accessToken, refreshToken, user: user[0]
                })
            } else {
                res.json({
                    message: "Password is not correct."
                })
            }
        }
    })
}
exports.token = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
}
exports.logout = (req, res) => {
    const token = req.body.token;
    refreshTokens = refreshTokens.filter(token => t !== token);
    res.send("Logout successful");
}