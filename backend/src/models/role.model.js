'use strict';
const dbConn = require('../../config/db.config')

var Role = function () {
}

Role.getByGroupID = (id, result) => {
    dbConn.query("SELECT id, nome\n" +
        "FROM usergroup_role\n" +
        "LEFT JOIN ROLE\n" +
        "ON usergroup_role.`role_id` = role.`id`\n" +
        "WHERE usergroup_role.`usergroup_id` =  ?", id, function (err, res) {
        if (err) result(err, null)
        else {
            result(null, res)
        }
    })
}
Role.getAll = (result) => {
    dbConn.query("Select id as value, nome as label from role", null, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
module.exports = Role