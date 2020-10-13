'use strict';
const UserGroup = require('../models/usergroup.model')

exports.getList = (req, result) =>  {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_ROOM_VIEW') || ownRole.includes( 'ROLE_USER_VIEW') || ownRole.includes('ROLE_USER_EDIT')){
        UserGroup.getList((err, group) => {
            if (err) result.send({error: true, message: err})
            else result.json({group})
        })
    } else result.send({error: true, message: 'No Permission'})
}

exports.getAll = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.getAll((err, group) => {
            if (err) result.send({error: true, message: err})
            else result.json({group})
        })
    } else result.send({error: true, message: 'No Permission'})
}
exports.addNew = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.addNew(req.body, (err, res) => {
            if (err) {
                err.code === 'ER_DUP_ENTRY' ? result.send({error: true, message: 'Group is already exist, try with another name'}) : result.send({error: true, message: err})
            }
            else result.json({message: 'Success'})
        })
    } else result.send({error: true, message: 'No Permission'})
}
exports.delete = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.delete(req.params.id, (err, res) => {
            if (err) result.send({error: true, message: err})
            else result.json({message: 'Success'})
        })
    } else result.send({error: true, message: 'No Permission'})
}
exports.update = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.update(req.params.id, req.body, (err, res) => {
            if (err) result.send({error: true, message: err.message})
            else result.json({message: 'Success'})
        })
    } else result.send({error: true, message: 'No Permission'})
}
