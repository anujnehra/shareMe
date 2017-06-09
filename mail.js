var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var router = require('./routing');
var connection = require("./database");

router.post('/mail/forgot/password', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },

        function (token, done) {
            var today = new Date();
            today.setHours(today.getHours() + 1);

            var insertionData = {
                email: req.body.email,
                reset_password_token: token,
                reset_password_expires: today
            };

            //Check for existing email in the system
            connection.query("SELECT * FROM sm_forgot_password WHERE email = '" + req.body.email + "'", function (err, results) {

                if (results.length > 0) {
                    var condition = {email: req.body.email};
                    //Update token for existing request
                    connection.query('update sm_forgot_password SET ? WHERE ?', [insertionData, condition], function (err, result) {
                        if (err) {
                            res.json({status: err, message: 'error'});
                        }
                        done(err, token);
                    });
                } else {
                    //Insert token if not there
                    connection.query('INSERT INTO sm_forgot_password SET ?', insertionData, function (err, result) {
                        if (err) {
                            res.json({status: err, message: 'error'});
                        }
                        done(err, token);
                    });
                }

            });
        },
        function (token, done) {

            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                auth: {
                    user: 'demo@gmail.com', //gmail account details
                    pass: 'password'
                }
            });

            var mailOptions = {
                to: req.body.email,
                from: 'passwordreset@shareme.com',
                subject: 'ShareMe Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/password/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.json({status: error, message: 'error'});
                } else {
                    res.json({
                        status: true,
                        message: 'An email has been sent to ' + req.body.email + ' with password reset instructions'
                    });
                }
            });
        }

    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});
/**
 * Validate token request for password change
 */
router.post('/reset/validate/token', function (req, res, next) {
    connection.query("SELECT * FROM sm_forgot_password WHERE reset_password_token = '" + req.body.token + "' AND reset_password_expires > NOW()", function (err, results) {
        if (err) {
            res.json({status: err, message: 'error'});
        }
        if (results.length > 0) {
            res.json({
                status: true,
                message: 'token validated'
            });
        } else {
            res.json({
                status: false,
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
});
/**
 * Reset Password based on token validation
 */
router.post('/reset/password', function (req, res, next) {
    if (req.body.password === req.body.password_c) {
        connection.query("SELECT email FROM sm_forgot_password WHERE reset_password_token = '" + req.body.tokenFromUrl + "' AND reset_password_expires > NOW()", function (err, results) {
            if (err) {
                res.render('success', {
                    status: err,
                    text: 'Error',
                    message: 'Error'
                });
            }

            if (results.length > 0) {
                var post = {
                    password: crypto.createHash('sha256').update(req.body.password).digest('base64')
                };
                var condition = {
                    email: results[0].email
                };

                connection.query('UPDATE sm_users SET ? WHERE ?', [post, condition],
                    function (err, results) {
                        if (err) {
                            res.render({status: err, message: 'error'});
                        }
                        if (results.affectedRows == 1) {
                            res.render('success', {
                                message: 'Your password has been changed successfully click on login to continue.',
                                text: 'Password Changed',
                                status: true
                            });
                        } else {
                            res.render('success', {
                                status: false,
                                text: 'Password not changed',
                                message: 'Unable to change password'
                            });
                        }
                    }
                );

            } else {
                res.render('success', {
                    status: false,
                    text: 'Invalid request',
                    message: 'Password reset token is invalid or has expired.'
                });
            }
        });
    }
});