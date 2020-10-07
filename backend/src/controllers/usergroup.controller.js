'use strict';
const UserGroup = require('../models/usergroup.model')

exports.getAll = (req, result) => {
    UserGroup.getAll((err, usergroups) => {
        if (err) result({message: err.message})
        else result({usergroups})
    })
}
exports.getTogether = (req, result) => {
    UserGroup.getTogether((err, groups) => {
        if (err) result.json({message: err.message})
        else result.json({groups})
    })
}
