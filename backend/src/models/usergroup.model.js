const dbConn = require('../../config/db.config')
var UserGroup = function (usergroup) {
}

UserGroup.getList = (result) => {
    dbConn.query("Select usergroup.id as value, usergroup.nome as label from usergroup", null, (err, res) => {
        if (err) result(err, null)
        else result(null, res)
    })
}

UserGroup.getAll = (result) => {
    dbConn.query(
        "SELECT usergroup.id, usergroup.`nome` AS name, GROUP_CONCAT(role.nome) AS roles\n" +
            "FROM usergroup, usergroup_role, ROLE \n" +
            "WHERE usergroup.id=usergroup_role.`usergroup_id`\n" +
            "AND usergroup_role.`role_id`=role.`id` \n" +
            "GROUP BY usergroup.`id`",
        null, (err, res) => {
            if (err) result(err, null)
            else result(null, res)
        })
}

UserGroup.addNew = (req, result) => {
    dbConn.query("Insert into usergroup set nome='" + req.name + "'", (error, response) => {
        if (error) result(error, null)
        else {
            const usergroup_id = response.insertId
            const roles = req.roles
            const val = roles.map((item => {
                return '(' + usergroup_id + ',' + item.value + ')'
            }))
            dbConn.query("Insert into usergroup_role (usergroup_id, role_id) values" + val, null,function (err, res) {
                if(err) result(err, null)
                else result(null, res)
            } )
        }
    })
}

UserGroup.update = (id, req, result) => {
    dbConn.query("Update usergroup set nome='" + req.name + "'" +'where id='+id, (error, response) => {
        if (error) result(error, null)
        else {
            const roles = req.roles
            const val = roles.map((item => {
                return '('+  + id + ',' + item.value + ')'
            }))
            dbConn.query("Delete from usergroup_role where usergroup_id ="+id, null, (errDel, resDel) => {
                if (errDel) result(errDel, null)
                else {
                    dbConn.query("Insert into usergroup_role (usergroup_id, role_id) values" + val, null,function (err, res) {
                        if(err) result(err, null)
                        else result(null, res)
                    } )
                }
            })

        }
    })
}

UserGroup.delete = (req, result) => {
    dbConn.query("Delete from usergroup_role where usergroup_id =" + req, null, function (error, response) {
        if (error) result(error, null)
        else {
            dbConn.query("Delete from usergroup where id=" + req, null, function (err, res) {
                if (err) result(err, null)
                else result(null, res)
            })
        }
    })
}

module.exports = UserGroup