'use strict';
const Patient = require('../models/patient.model')

exports.getAll = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_VIEW')){
        Patient.getAll((err, patient) => {
            if (err) res.send({error: true, message: patient.message})
            else res.json({patient})
        })
    } else res.send({error: true, message: 'No Permission'})

}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        const patient = new Patient(req.body)
        Patient.addNew(req.body.email, patient, (err, result) => {
            console.log(err)
            if (err) res.json({message: err.message})
            if (result.length > 0) res.json({message: "User is already exist. Please enter another email."})
            else res.json({message: "Success"})
        })
    } else res.send({error: true, message: 'No Permission'})
}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        const patient = new Patient(req.body)
        Patient.update(req.params.id,patient, (err, result) => {
            if (err) res.json({message: err.message})
            else res.json({message: "Success"})
        })
    } else res.send({error: true, message: 'No Permission'})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        Patient.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message})
            else res.json({message: 'Success'})
        })
    } else res.send({error: true, message: 'No Permission'})
}