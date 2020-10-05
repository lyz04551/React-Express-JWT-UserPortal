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