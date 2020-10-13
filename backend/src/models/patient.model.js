'use strict';
const dbConn = require('../../config/db.config')
const Patient = (value) => {
    this.name = value.name
    this.CPF  = value.CPF
    this.gender = value.gender
    this.birthday = value.birthday
    this.email = value.email
    this.occupation = value.occupation
    this.comments = value.comments
    this.picture = value.picture
    this.fk_license = value.fk_license
    this.deleted = value.deleted
}

Patient.getAll = (result) => {
    dbConn.query('Select id, name, CPF, gender, birthday, email, occupation, comments, picture, fk_license, deleted from patients', null, (err, res) =>{
        if (err) result(err, null)
        else result(null, res)
    })
}
Patient.addNew = (email, data, result) => {
    dbConn.query("Select * from patients where email=" + JSON.stringify(email), null,(err, res) => {
        if (err) result(err, null)
        if (res.length === 0) {
            dbConn.query('INSERT into patients set ?', data,(error, response) => {
                if (error) result(error, null)
                else result(null, response)
            })
        } else {
            result(null, res)
        }
    })
}
Patient.update = (id, data, result) => {
    dbConn.query('update patients set ? where id = ' + id, data, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
Patient.delete = (id, result) => {
    const sql = "DELETE FROM patients WHERE id=" + id
    dbConn.query(sql, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}

module.exports = Patient