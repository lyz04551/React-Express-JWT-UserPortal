'use strict';
var dbConn = require('../../config/db.config')

var Professional = () => {

}

Professional.getAll = (result) => {
    dbConn.query("Select * from professionals", null, (err, res) => {
        if (err) result(err.message, null)
        else result(null, res)
    })
}

module.exports = Professional