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
    dbConn.query("SELECT id, NAME, username, email, pass, initcode, cpf, birthday, gender, MASTER, active, fk_professional, fk_license, deleted, creation_timestamp, role_id, usergroup_id\n" +
        "FROM users\n" +
        "LEFT JOIN users_role\n" +
        "ON users.`id` = users_role.`users_id`\n" +
        "LEFT JOIN users_usergroup\n" +
        "ON users.`id` = users_usergroup.`users_id`\n" +
        "WHERE email = ?", email, function (err, res) {
        if (err) {
            console.log("error:", err)
            result(err, null);
        } else {
            result(null, res);
        }
    })
}
module.exports = Auth;