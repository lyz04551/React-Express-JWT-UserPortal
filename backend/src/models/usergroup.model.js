const dbConn = require('../../config/db.config')
const Role = require('../models/role.model')
var UserGroup = (usergroup) => {
}
UserGroup.getAll = (req, result) => {
    dbConn.query("Select * from usergroup", null, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}
UserGroup.getTogether = (result) => {
    dbConn.query(
        "SELECT usergroup.`id`, usergroup.`nome`, role_id, role.`nome` AS role_name\n" +
            "FROM usergroup \n" +
            "LEFT JOIN usergroup_role\n" +
            "ON usergroup.`id` = usergroup_id\n" +
            "LEFT JOIN ROLE\n" +
            "ON role_id = role.`id`",
        null, (err, res) => {
            if (err) result(err, null)
            else result(null, res)
        })
}

UserGroup.create = (req, result) => {

    dbConn.query("Insert from usergroup")
}


module.exports = UserGroup