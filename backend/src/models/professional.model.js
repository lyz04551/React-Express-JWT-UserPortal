'use strict';
var dbConn = require('../../config/db.config');

var Professional = function (professional) {
    this.name = professional.name;
}

Professional.getAll = function (){
    dbConn.query("Select * from professaionls", function (err, res) {
        if (err) result(err, null);
        console.log("sdfsdf")
    })
}
module.exports = Professional;