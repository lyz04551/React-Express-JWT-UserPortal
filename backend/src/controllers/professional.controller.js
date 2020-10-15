'use strict';
const Professional = require('../models/professional.mode');

exports.getAll = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_PROF_VIEW')){
        Professional.getAll(function(err, professionals) {
            if (err) res.json({
                message: err.message
                , accessToken, refreshToken
            })
            res.send({professionals, accessToken, refreshToken})
        });
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_PROF_VIEW')){
        Professional.addNew(req.body, (err, result) => {
            console.log(err)
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else{
                if (result.length > 0) res.json({message: "User is already exist. Please enter another email.", accessToken, refreshToken})
                else res.json({message: "Success", accessToken, refreshToken})
            }

        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_PROF_VIEW')){
        Professional.update(req.params.id, req.body, (err, result) => {
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else res.json({message: "Success", accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_PROF_VIEW')){
        Professional.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else res.json({message: 'Success', accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}