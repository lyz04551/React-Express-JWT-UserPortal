'use strict';
const Auth = require('../models/user.model')
const Role = require('../models/role.model')
const jwt_config = require('../../config/jwt_config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let refreshTokens = []
const refreshTokenSecret = jwt_config.refreshTokenSecret
const accessTokenSecret = jwt_config.accessTokenSecret
const saltRounds = jwt_config.saltRounds
const jwt_timeout = jwt_config.jwt_timeout

exports.getdAll = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_USER_VIEW')) {
        Auth.getAll(function(err, users) {
            console.log('controller')
            if (err) {
                err.accessToken = accessToken
                err.refreshToken = refreshToken
                res.send(err)
            }
            else res.json({users, accessToken, refreshToken})
        })
    } else res.send({error: true, message:'No permission'})
}
exports.addNew = function (req, res){
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
//    handles null error
    if (ownRole.includes('ROLE_USER_EDIT')) {
        req.body.pass = bcrypt.hashSync(req.body.pass, saltRounds)
        const new_user = new Auth(req.body)
        Auth.addNew(new_user, req.body.usergroup.value, (err, user) => {
            if (err) {
                err.accessToken = accessToken
                err.refreshToken = refreshToken
                res.send(err)
            }
            else {
                if (user.length > 0) res.json({message: "User is already exist. Please enter another Email or User Name.", accessToken, refreshToken})
                else res.json({message: "Success", accessToken, refreshToken})
            }
        })
    } else res.send({error: true, message:'No permission'})
}
exports.update = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_USER_EDIT')) {
        req.body.pass = bcrypt.hashSync(req.body.pass, saltRounds)
        const new_user = new Auth(req.body)
        Auth.update(req.params.id, req.body.usergroup.value, new_user, (err, user) => {
            console.log(err)
            if (err) {
                err.accessToken = accessToken
                err.refreshToken = refreshToken
                res.send(err)
            }
            else res.json({message: "Success", accessToken, refreshToken})
        })
    } else res.send({error: true, message:'No permission', accessToken, refreshToken})
}
exports.delete = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_USER_EDIT')) {
        Auth.delete(req.params.id, (err, user) => {
            if (err) res.json({message: err.message})
            else res.json({message: 'Success', accessToken, refreshToken})
        })
    } else res.send({error: true, message:'No permission', accessToken, refreshToken})
}

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.headers.token;
    req.accessToken = null
    req.refreshToken = null
    const newToken = function () {
        if (!token) return res.sendStatus(401);
        if(!refreshTokens.includes(token)) return res.sendStatus(403);
        jwt.verify(token, refreshTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign({ username: user[0].username, role: user.role }, refreshTokenSecret)
            refreshTokens = refreshTokens.map(saved_token => saved_token !== token);
            refreshTokens.push(refreshToken)
            req.accessToken = accessToken
            req.refreshToken = refreshToken
            req.user = user
        });
    }
    if ((req.method ==='POST' || req.method === 'PUT') && req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({error: true, message: 'Please provide all required field', accessToken: null, refreshToken: null})
    }  else {
        if (authHeader) {
            // console.log(authHeader)
            jwt.verify(authHeader, accessTokenSecret, (err, user) => {
                // console.log(err)
                if (err) {
                    if (err.message === "jwt expired") {
                        newToken()
                    } else res.sendStatus(403)
                } else req.user = user
                next()
            })
        } else
            res.sendStatus(401)
    }
}
exports.login = (req, res) => {
    const { email, pass } = req.body
    console.log(req.body)
    if (req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({error: true, message: 'Please provide all required field', accessToken: null, refreshToken: null})
    } else {
        Auth.findByEmail(email, function (err, user) {
            if (err)
                res.send(err)
            if (user.length === 0)
                res.json({
                    message: "Account is not exist"
                })
            else {
                Role.getByGroupID(user[0].usergroup_id, (error, roles) => {
                    const match = bcrypt.compareSync(pass, user[0].pass)
                    if (match) {
                        const accessToken = jwt.sign({ username: user[0].username, role: roles }, accessTokenSecret,
                            { expiresIn: jwt_timeout })
                        const refreshToken = jwt.sign({ username: user[0].username, role: roles }, refreshTokenSecret)
                        refreshTokens.push(refreshToken)
                        user[0].roles = roles
                        user[0].pass = ''
                        res.json({
                            accessToken, refreshToken, user: user[0]
                        })
                    } else {
                        res.json({
                            message: "Password is not correct."
                        })
                    }
                })
            }
        })
    }
}
exports.logout = (req, res) => {
    const token = req.headers.token;
    console.log(refreshTokens.includes(token))
    refreshTokens = refreshTokens.map(saved_token => saved_token !== token);
    console.log(refreshTokens.includes(token))
    res.send("Logout successful");
}