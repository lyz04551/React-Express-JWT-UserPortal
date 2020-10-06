'use strict';
const Professional = require('../models/professional.mode');

exports.getAll = function (req, res) {
    Professional.getAll(function(err, professionals) {
        if (err) res.json({
            message: err.message
        })
        res.send({professionals})
    });
}
exports.addNew = function (req, res) {

    Professional.addNew(req.body, (err, result) => {
        console.log(err)
        if (err) res.json({message: err.message})
        if (result.length > 0) res.json({message: "User is already exist. Please enter another email."})
        else res.json({message: "Success"})
    })
}
exports.update = function (req, res) {
    Professional.update(req.params.id, req.body, (err, result) => {
        if (err) res.json({message: err.message})
        else res.json({message: "Success"})
    })
}
exports.delete = function (req, res) {
    Professional.delete(req.params.id, (err, result) => {
        if (err) res.json({message: err.message})
        else res.json({message: 'Success'})
    })
}