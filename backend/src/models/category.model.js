'use strict';
const dbConn = require('../../config/db.config')
var Category = function(value){
    this.name = value.name
    this.nickname = value.nickname
    this.amount_patients = value.amount_patients
    this.amount_suitable_overflow = value.amount_suitable_overflow
    this.duration_time = value.duration_time
    this.color = value.color
    this.deleted = value.deleted
    this.fk_license = value.fk_license
}

Category.getAll = (result) => {
    dbConn.query('Select id, name, nickname, amount_patients, amount_suitable_overflow, duration_time, color, deleted, fk_license from categories', null, (err, res) =>{
        if (err) result(err, null)
        else result(null, res)
    })
}
Category.addNew = (name, data, result) => {
    dbConn.query("Select * from categories where name=" + JSON.stringify(name), null, (err, res) => {
        if (err) result(err, null)
        if (res.length === 0) {
            dbConn.query('INSERT into categories set ?', data,(error, response) => {
                if (error) result(error, null)
                else result(null, response)
            })
        } else {
            result(null, res)
        }
    })
}
Category.update = (id, data, result) => {
    dbConn.query('update categories set ? where id = ' + id, data, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
Category.delete = (id, result) => {
    const sql = "DELETE FROM categories WHERE id=" + id
    dbConn.query(sql, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}

module.exports = Category