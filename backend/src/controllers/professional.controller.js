'use strict';
const professional = require('../models/professional.model');

exports.getAll = function (req, res) {
    professional.getAll(function(err, professional) {
        console.log('controller')
        if (err) res.send(err)
        console.log('res', professional)
        res.send(professional)
    });
}