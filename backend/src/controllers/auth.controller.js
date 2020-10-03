'use strict';
const Auth = require('../models/auth.model');

exports.findAll = function (req, res) {
    auth.getAll(function(err, professional) {
        console.log('controller')
        if (err) res.send(err)
        console.log('res', professional)
        res.send(professional)
    });
}
exports.create = function (req, res){
    const new_user = new Auth(req.body)

//    handles null error
    if (req.body.constructor === Object && Object.keys(req.body).length === 0){
        console.log(req.body)
        res.status(400).send({error: true, message: 'Please provide all required field'})
    } else {
        Auth.findById(req.body.email, function (err, result) {

        })
        Auth.create(new_user, function (err, user) {
            if (err)
                res.send(err)
            res.send({error:false, message: 'User added successfully!', data: user})
        })
    }
}
exports.findById = function (req, res) {
    Auth.findById(req.params.id, function (err, user) {
        if (err)
            res.send(err)
        res.json(user)
    })
}