'use strict';
const Auth = require('../models/user.model')
const Role = require('../models/role.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const accessTokenSecret = "t"
const refreshTokenSecret = "e"
const refreshTokens = []
const saltRounds = 10

exports.getdAll = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_USER_VIEW')) {
        Auth.getAll(function(err, users) {
            console.log('controller')
            if (err) res.send(err)
            else res.json({users})
        })
    } else res.send({error: true, message:'No permission'})
}
exports.addNew = function (req, res){
    const ownRole = req.user.role.map(item => item.nome)
//    handles null error
    if (ownRole.includes('ROLE_USER_EDIT')) {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0){
            console.log(req.body)
            res.status(400).send({error: true, message: 'Please provide all required field'})
        } else {
            req.body.pass = bcrypt.hashSync(req.body.pass, saltRounds)
            const new_user = new Auth(req.body)
            Auth.addNew(new_user, req.body.usergroup.value, (err, user) => {
                if (err) res.send(err)
                if (user.length){
                    if (user.length > 0) res.json({message: "User is already exist. Please enter another Email or User Name."})
                }
                else res.json({message: "Success"})
            })
        }
    } else res.send({error: true, message:'No permission'})
}
exports.update = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_USER_EDIT')) {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0){
            console.log(req.body)
            res.status(400).send({error: true, message: 'Please provide all required field'})
        } else {
            req.body.pass = bcrypt.hashSync(req.body.pass, saltRounds)
            const new_user = new Auth(req.body)
            Auth.update(req.params.id, req.body.usergroup.value, new_user, (err, user) => {
                console.log(err)
                if (err) res.send(err)
                else res.json({message: "Success"})
            })
        }
    } else res.send({error: true, message:'No permission'})
}
exports.delete = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_USER_EDIT')) {
        Auth.delete(req.params.id, (err, user) => {
            if (err) res.json({message: err.message})
            else res.json({message: 'Success'})
        })
    } else res.send({error: true, message:'No permission'})
}

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader
        console.log(token)
        jwt.verify(token, accessTokenSecret, (err, user) => {
            console.log(err)
            if (err) {
                return err.message === "jwt expired"? res.json({message: "jwt expired"}): res.sendStatus(403)
            }
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
            Role.getByGroupID(user[0].usergroup_id, (error, roles) => {
                const match = bcrypt.compareSync(pass, user[0].pass)
                if (match) {
                    const accessToken = jwt.sign({ username: user[0].username, role: roles }, accessTokenSecret,
                        { expiresIn: '20m' })
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
    console.log(refreshTokens)
    const result = refreshTokens.filter(saved_token => saved_token !== token);
    const leng = refreshTokens.length;
    refreshTokens.splice(0, leng, result)
    console.log(refreshTokens)
    res.send("Logout successful");
}