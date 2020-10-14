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
    this.active = 0
    this.gender = user.gender
    this.master = user.master
    this.active = user.active
    this.fk_professional = user.fk_professional
    this.fk_license = user.fk_license
    this.deleted = user.deleted ? user.deleted : 0
}
Auth.getAll = function(result){
    dbConn.query(
        `SELECT users.id, name, username, usergroup.nome AS user_group, email, initcode, cpf, birthday, gender, master, active, fk_professional, fk_license, deleted, creation_timestamp 
                FROM users 
                LEFT JOIN users_usergroup 
                ON users.id = users_usergroup.users_id 
                LEFT JOIN usergroup ON users_usergroup.usergroup_id = usergroup.id
            `,
        null, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
Auth.addNew = function(data, usergroup, result){
    dbConn.query(`Select * from users where username=${JSON.stringify(data['username'])} OR email= ${JSON.stringify( data['email'])}`, null,(err, res) => {
        console.log(err)
        if (err) result(err, null)
        if (res.length === 0) {
            dbConn.query("INSERT INTO users set ?", data, function (error, response) {
                if (error) {
                    console.log("error:", error)
                    result(error, null);
                } else {
                    console.log(response.insertId);
                    dbConn.query(`Insert into users_usergroup set users_id=${response.insertId}, usergroup_id=${usergroup}`, null,(errThr, resThr) => {
                        console.log(errThr)
                        if (errThr) result(error, null)
                        else result(null, response)
                    })
                }
            })
        } else {
            result(null, res)
        }
    })
}
Auth.update = function(id, usergroup, data, result){
    dbConn.query(`UPDATE users SET ? where id =${id}`, data, (err, res) => {
        if (err) result(err, null)
        else {
            dbConn.query(`Update users_usergroup Set usergroup_id=${usergroup} where users_id=${id}`, null,(error, response) => {
                err ? result(error, null) : result(null, response)
            })
        }
    })
}
Auth.delete = function(id, result) {
    dbConn.query(`Delete from users_usergroup where users_id = ${id}`,null, (error, response) => {
        if (error) result(error, null)
        else {
            dbConn.query(`Delete from users Where id=${id}`, null, (err, res) => {
                err ? result(err, null) : result(null, res)
            })
        }
    })
}
Auth.findByEmail = function (email, result) {
    let val = []
    dbConn.query(`SELECT users.id, NAME, username, email, pass, initcode, cpf, birthday, gender, MASTER, active, fk_professional, fk_license, deleted, creation_timestamp, usergroup_id, usergroup.nome
        FROM users
        LEFT JOIN users_usergroup
        ON users.id = users_usergroup.users_id
        LEFT JOIN usergroup
        ON usergroup_id = usergroup.id
        WHERE email = ?`, email, function (err, res) {
        if (err) {
            console.log("error:", err)
            result(err, null);
        } else {
            result(null, res);
        }
    })
}

module.exports = Auth;