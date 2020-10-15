'use strict';
const License = require('../models/license.model')

exports.getAll = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_LIC_VIEW')){
        License.getAll((err, license) => {
            if (err) res.send({error: true, message: err.message,accessToken, refreshToken})
            else res.json({license,accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission',accessToken, refreshToken})
}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_LIC_EDIT')){
        const license = new License(req.body)
        License.addNew(req.body.name, license, (err, result) => {
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else{
                if (result.length > 0) res.json({message: "Category is already exist. Please enter another email.",accessToken, refreshToken})
                else res.json({message: "Success",accessToken, refreshToken})
            }
        })
    } else  res.send({error: true, message: 'No Permission',accessToken, refreshToken})
}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_LIC_EDIT')){
        const license = new License(req.body)
        License.update(req.params.id,license, (err, result) => {
            if (err) res.json({message: err.message,accessToken, refreshToken})
            else res.json({message: "Success",accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission',accessToken, refreshToken})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_LIC_EDIT')){
        License.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message,accessToken, refreshToken})
            else res.json({message: 'Success',accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission',accessToken, refreshToken})
}