'use strict';
const License = require('../models/license.model')

exports.getAll = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_LIC_VIEW')){
        License.getAll((err, license) => {
            if (err) res.send({error: true, message: err.message})
            else res.json({license})
        })
    } else res.send({error: true, message: 'No Permission'})
}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_LIC_EDIT')){
        const license = new License(req.body)
        License.addNew(req.body.name, license, (err, result) => {
            if (err) res.json({message: err.message})
            else{
                if (result.length > 0) res.json({message: "Category is already exist. Please enter another email."})
                else res.json({message: "Success"})
            }
        })
    } else  res.send({error: true, message: 'No Permission'})
}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_LIC_EDIT')){
        const license = new License(req.body)
        License.update(req.params.id,license, (err, result) => {
            if (err) res.json({message: err.message})
            else res.json({message: "Success"})
        })
    } else res.send({error: true, message: 'No Permission'})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_LIC_EDIT')){
        License.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message})
            else res.json({message: 'Success'})
        })
    } else res.send({error: true, message: 'No Permission'})
}