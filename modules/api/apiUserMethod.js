var connection = require("./../../database");
var crypto = require('crypto');

exports.login = function (req, res) {
    connection.query("SELECT 1 FROM sm_users WHERE email = '" + req.body.email + "' AND password = '" + crypto.createHash('sha256').update(req.body.password).digest('base64') + "' ORDER BY id LIMIT 1", function (error, results) {
        if (results.length > 0) {
            res.send({success: true, message: '', data: results});
        } else {
            res.send({success: false, message: 'Incorrect details', data: results});
        }

    });

};

exports.create = function (req, res) {
    var post = {
        password: crypto.createHash('sha256').update(req.body.password).digest('base64'),
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        created_at: new Date(),
        gender: req.body.gender
    };
    var sql = connection.query('INSERT INTO sm_users SET ?', post, function (err, result) {
        if (err) {
            res.send({
                "status": "failure",
                "message": 'error occurred in create method - ' + err.code
            });
        } else if (result.insertId > 0) {
            res.send({success: true, message: 'successfully created', data: result});
        } else {
            res.send({success: false, message: 'sorry, unable to register', data: result});
        }
    });

};

exports.fetchUserByEmail = function (req, res) {
    connection.query("SELECT * FROM sm_users WHERE email = '" + req.body.email + "' ", function (error, results) {
        if (error) {
            logError(error, res);
        }
        if (results.length > 0) {
            res.send({success: true, message: '', data: results});
        } else {
            res.send({success: false, message: 'email address not found', data: results});
        }

    });
};