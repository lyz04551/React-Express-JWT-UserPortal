'use strict';
const Role = require('../models/role.model')

exports.getByGroupID = (req, res) => {
    Role.getByGroupID(req.params.id, (err, roles) => {
        if (roles){
            res.json(roles)
        } else
            res.json({message: err.message})
    })
}
exports.getAll = (req, res) => {
    Role.getAll((err, role) => {
        if (err) res.json({message: err.message})
        else res.json({role})
    })
}