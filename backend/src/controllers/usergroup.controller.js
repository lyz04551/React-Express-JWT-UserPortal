'use strict';
const UserGroup = require('../models/usergroup.model')

exports.getList = (req, result) =>  {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_ROOM_VIEW') || ownRole.includes( 'ROLE_USER_VIEW') || ownRole.includes('ROLE_USER_EDIT')){
        UserGroup.getList((err, group) => {
            if (err) result.send({error: true, message: err, accessToken, refreshToken})
            else result.json({group, accessToken, refreshToken})
        })
    } else result.send({error: true, message: 'No Permission', accessToken, refreshToken})
}

exports.getAll = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.getAll((err, group) => {
            if (err) result.send({error: true, message: err, accessToken, refreshToken})
            else result.json({group, accessToken, refreshToken})
        })
    } else result.send({error: true, message: 'No Permission', accessToken, refreshToken})
}

exports.addNew = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.addNew(req.body, (err, res) => {
            if (err) {
                err.code === 'ER_DUP_ENTRY' ? result.send({error: true, message: 'Group is already exist, try with another name', accessToken, refreshToken}) : result.send({error: true, message: err, accessToken, refreshToken})
            }
            else result.json({message: 'Success', accessToken, refreshToken})
        })
    } else result.send({error: true, message: 'No Permission', accessToken, refreshToken})
}

exports.delete = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.delete(req.params.id, (err, res) => {
            if (err) result.send({error: true, message: err, accessToken, refreshToken})
            else {
                res.length > 0 ? result.send({error: true, message: 'Group is used by any user yet.', accessToken, refreshToken}) : result.json({message: 'Success', accessToken, refreshToken})
            }
        })
    } else result.send({error: true, message: 'No Permission', accessToken, refreshToken})
}

exports.update = (req, result) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_ROOM_VIEW')){
        UserGroup.update(req.params.id, req.body, (err, res) => {
            if (err) result.send({error: true, message: err.message, accessToken, refreshToken})
            else result.json({message: 'Success', accessToken, refreshToken})
        })
    } else result.send({error: true, message: 'No Permission', accessToken, refreshToken})
}
