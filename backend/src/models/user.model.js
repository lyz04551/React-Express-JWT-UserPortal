'use strict';
var dbConn = require('../../config/db.config');

var Auth = function (user) {
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.pass = user.pass
    // this.initcode = user.initcode
    // this.cpf = user.cpf
    // this.birthday = user.birthday
    this.gender = user.gender
    // this.master = user.master
    // this.active = user.active
    // this.fk_professional = user.fk_professional
    // this.fk_license = user.fk_license
    this.deleted = user.deleted ? user.deleted : 0;
}
Auth.create = function(data, result){
    dbConn.query("INSERT INTO users set ?", data, function (err, res) {
        if (err) {
            console.log("error:", err)
            result(err, null);
        } else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    })
}
Auth.findByEmail = function (email, result) {
    dbConn.query("Select * from users where email = ?", email, function (err, res) {
        if (err) {
            console.log("error:", err)
            result(err, null);
        } else {
            result(null, res);
        }
    })
}
module.exports = Auth;