'use strict';
const Category = require('../models/category.model')

exports.getAll = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_VIEW')){
        Category.getAll((err, category) => {
            if (err) res.send({error: true, message: err.message})
            else res.json({category})
        })
    }  else res.send({error: true, message:'No permission'})
}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        const category = new Category(req.body)
        Category.addNew(req.body.name, category, (err, result) => {
            console.log(err)
            if (err) res.json({message: err.message})
            else {
                if (result.length > 0) res.json({message: "Category is already exist. Please enter another name."})
                else res.json({message: "Success"})
            }
        })
    } else res.send({error: true, message:'No permission'})

}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_EDIT')) {
        const category = new Category(req.body)
        Category.update(req.params.id,category, (err, result) => {
            if (err) res.json({message: err.message})
            else res.json({message: "Success"})
        })
    }  else res.send({error: true, message:'No permission'})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        Category.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message})
            else res.json({message: 'Success'})
        })
    }  else res.send({error: true, message:'No permission'})
}