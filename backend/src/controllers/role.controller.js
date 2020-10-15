'use strict';
const Role = require('../models/role.model')

exports.getByGroupID = (req, res) => {
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    Role.getByGroupID(req.params.id, (err, roles) => {
        if (roles){
            res.json(roles, accessToken, refreshToken)
        } else
            res.json({message: err.message, accessToken, refreshToken})
    })
}
exports.getAll = (req, res) => {
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    Role.getAll((err, role) => {
        if (err) res.json({message: err.message, accessToken, refreshToken})
        else res.json({role, accessToken, refreshToken})
    })
}