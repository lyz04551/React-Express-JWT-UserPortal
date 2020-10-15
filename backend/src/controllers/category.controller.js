'use strict';
const Category = require('../models/category.model')

exports.getAll = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_VIEW')){
        Category.getAll((err, category) => {
            if (err) res.send({error: true, message: err.message,accessToken, refreshToken})
            else res.json({category,accessToken, refreshToken})
        })
    }  else res.send({error: true, message:'No permission',accessToken, refreshToken})
}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        const category = new Category(req.body)
        Category.addNew(req.body.name, category, (err, result) => {
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else {
                if (result.length > 0) res.json({message: "Category is already exist. Please enter another name.", accessToken, refreshToken})
                else res.json({message: "Success",accessToken, refreshToken})
            }
        })
    } else res.send({error: true, message:'No permission',accessToken, refreshToken})

}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_EDIT')) {
        const category = new Category(req.body)
        Category.update(req.params.id,category, (err, result) => {
            if (err) res.json({message: err.message,accessToken, refreshToken})
            else res.json({message: "Success",accessToken, refreshToken})
        })
    }  else res.send({error: true, message:'No permission',accessToken, refreshToken})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        Category.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message,accessToken, refreshToken})
            else res.json({message: 'Success',accessToken, refreshToken})
        })
    }  else res.send({error: true, message:'No permission',accessToken, refreshToken})
}