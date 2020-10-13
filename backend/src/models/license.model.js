'use strict';
const dbConn = require('../../config/db.config')
var License = function(value){
    this.name = value.name
    this.fk_user = value.fk_user
    this.creation_time = value.creation_time
    this.expiration_date = value.expiration_date
    this.fixed_time = value.fixed_time
    this.all_markers = value.all_markers
    this.agenda_interval = value.agenda_interval
    this.agenda_start = value.agenda_start
    this.agenda_ending = value.agenda_ending
    this.reminder_msg_event = value.reminder_msg_event
    this.cat_color_active = value.cat_color_active
    this.locked = value.locked
}

License.getAll = (result) => {
    dbConn.query('Select id, name, fk_user, creation_time, expiration_date, fixed_time, all_markers, agenda_interval, agenda_start, agenda_ending,reminder_msg_event, cat_color_active ,locked from licenses', null, (err, res) =>{
        console.log(err)
        if (err) result(err, null)
        else result(null, res)
    })
}
License.addNew = (name, data, result) => {
    dbConn.query("Select * from licenses set ? where email=" + JSON.stringify(name), null, (err, res) => {
        if (err) result(err, null)
        if (res.length === 0) {
            dbConn.query('INSERT into licenses set ?', data,(error, response) => {
                if (error) result(error, null)
                else result(null, response)
            })
        } else {
            result(null, res)
        }
    })
}
License.update = (id, data, result) => {
    dbConn.query('update licenses set ? where id = ' + id, data, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
License.delete = (id, result) => {
    const sql = "DELETE FROM licenses WHERE id=" + id
    dbConn.query(sql, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}

module.exports = License