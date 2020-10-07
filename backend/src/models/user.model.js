'use strict';
var dbConn = require('../../config/db.config');

var Auth = function (user) {
    this.name = user.name
    this.username = user.username
    this.email = user.email
    this.pass = user.pass
    this.initcode = user.initcode
    this.cpf = user.cpf
    this.birthday = user.birthday
    this.gender = user.gender
    this.master = user.master
    this.active = user.active
    this.fk_professional = user.fk_professional
    this.fk_license = user.fk_license
    this.deleted = user.deleted ? user.deleted : 0;
}
Auth.getAll = function(result){
    dbConn.query("Select id, name, username, email, initcode, cpf, birthday, gender, master, active, fk_professional, fk_license, deleted, creation_timestamp from users", null, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
Auth.create = function(data, result){
    dbConn.query("Select * from users where username=" + JSON.stringify(data['username']) + "OR email=" + JSON.stringify( data['email']), (err, res) => {
        console.log(err)
        if (err) result(err, null)
        if (res.length === 0) {
            dbConn.query("INSERT INTO users set ?", data, function (error, response) {
                if (error) {
                    console.log("error:", error)
                    result(error, null);
                } else {
                    console.log(response.insertId);
                    result(null, response.insertId);
                }
            })
        } else {
            result(null, res)
        }
    })
}
Auth.update = function(id, data, result){
    dbConn.query("UPDATE users SET ? where id =" + id, data, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
Auth.delete = function(id, result) {
    dbConn.query("Delete from users Where id=" + id, null, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
Auth.findByEmail = function (email, result) {
    let val = []
    dbConn.query("SELECT users.`id`, NAME, username, email, pass, initcode, cpf, birthday, gender, MASTER, active, fk_professional, fk_license, deleted, creation_timestamp, usergroup_id, usergroup.`nome`\n" +
        "FROM users\n" +
        "LEFT JOIN users_usergroup\n" +
        "ON users.`id` = users_usergroup.`users_id`\n" +
        "LEFT JOIN usergroup\n" +
        "ON usergroup_id = usergroup.`id`\n" +
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