'use strict';
const Patient = require('../models/patient.model')

exports.getAll = (req, res) => {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_VIEW')){
        Patient.getAll((err, patient) => {
            if (err) res.send({error: true, message: patient.message, accessToken, refreshToken})
            else res.json({patient, accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})

}
exports.addNew = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        const patient = new Patient(req.body)
        Patient.addNew(req.body.email, patient, (err, result) => {
            console.log(err)
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else {
                if (result.length > 0) res.json({message: "User is already exist. Please enter another email.", accessToken, refreshToken})
                else res.json({message: "Success", accessToken, refreshToken})
            }
        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}
exports.update = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        const patient = new Patient(req.body)
        Patient.update(req.params.id,patient, (err, result) => {
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else res.json({message: "Success", accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}
exports.delete = function (req, res) {
    const ownRole = req.user.role.map(item => item.nome)
    const accessToken = req.accessToken
    const refreshToken = req.refreshToken
    if (ownRole.includes('ROLE_TARGET_EDIT')){
        Patient.delete(req.params.id, (err, result) => {
            if (err) res.json({message: err.message, accessToken, refreshToken})
            else res.json({message: 'Success', accessToken, refreshToken})
        })
    } else res.send({error: true, message: 'No Permission', accessToken, refreshToken})
}