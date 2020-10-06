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

Professional.addNew = (data, result) => {
    const values = [data.name, data.gender, data.birthday, data.email, data.comment, data.picture, data.deleted, data.fk_license]
    const strVal = []
    values.forEach(val => {
        strVal.push(JSON.stringify(val))
    })
    const sql =  "INSERT INTO professionals(name, gender, birthday, email, comment, picture, deleted, fk_license) VALUES(" + strVal + ")"


    dbConn.query("Select * from professionals where email=" + strVal[3], (err, res) => {
        if (err) result(err.message, null)
        if (res.length === 0) {
            dbConn.query(sql,(error, response) => {
                if (error) result(error.message, null)
                else result(null, response)
            })
        } else {
            result(null, res)
        }
    })


}

Professional.update = (id, data, result) => {
    const values = [data.name, data.gender, data.birthday, data.email, data.comment, data.picture, data.deleted, data.fk_license, id]
    const strVal = []
    values.forEach(val => {
        strVal.push(JSON.stringify(val))
    })
    const sql = 'UPDATE professionals SET name='+strVal[0]+', gender='+strVal[1]+', birthday='+strVal[2]+', email='+strVal[3]+
        ', comment='+strVal[4]+', picture='+strVal[5]+', deleted='+strVal[6]+', fk_license='+strVal[7]+ 'WHERE id='+strVal[8]
    console.log(sql)
    dbConn.query(sql, (err, res) => {
        console.log("error", err)
        console.log(res)
        if (err) result(err, null)
        else result(null, res)
    })
}

Professional.delete = (id, result) => {
    const val = JSON.stringify(id)
    const sql = "DELETE FROM professionals WHERE id=" + val
    dbConn.query(sql, (err, res) => {
        if (err) result(err.message, null)
        else result(null, res)
    })
}
module.exports = Professional