'use strict';
const Professional = require('../models/professional.mode');

exports.getAll = function (req, res) {
    Professional.getAll(function(err, professionals) {
        console.log('controller')
        if (err) res.json({
            message: err.message
        })
        console.log('res', professionals)
        res.send({professionals})
    });
}