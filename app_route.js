var connection = require("./database");
var crypto = require('crypto');

module.exports = function (app, routes) {

    /**
     * Login GET
     */
    app.get('/login', function (req, res, next) {
        if (typeof req.session.user_id != "number") {
            res.render('index');
        } else {
            res.redirect('/profile');
        }
    });

    /**
     * / GET
     */
    app.get('/', checkAuth, function (req, res) {
        res.redirect('/profile');
    });

    /**
     * Profile GET
     */
    app.get('/profile', checkAuth, function (req, res) {
        connection.query("SELECT * FROM sm_profile WHERE user_id = '" + req.session.user_id + "' AND display_picture IS NOT NULL AND phone IS NOT NULL AND interest IS NOT NULL", function (error, results) {
            if (results.length > 0) {
                res.send({success: true, message: '', data: ''});
            } else {
                res.send({success: false, message: 'profile not exist', data: results});
            }
        });
    });

    /**
     * ProfileHome GET
     */
    app.get('/home', checkAuth, function (req, res) {
        res.render('index');
    });


    /**
     * Login POST
     */
    app.post('/login', function (req, res, next) {
        connection.query("SELECT * FROM sm_users WHERE email = '" + req.body.email + "' AND password = '" + crypto.createHash('sha256').update(req.body.password).digest('base64') + "' AND is_active = 1 ORDER BY id LIMIT 1", function (error, results) {
            if (results.length > 0) {
                req.session.user_id = results[0].id;
                res.send({success: true, message: '', data: results});
            } else {
                res.send({success: false, message: 'Incorrect details', data: results});
            }
        });
    });

    /**
     * Logout GET
     */
    app.get('/logout', function (req, res) {
        delete req.session.user_id;
        res.redirect('/login');
    });

    /**
     * Register GET
     */
    app.get('/register', checkAuth, function (req, res) {
        res.render('index');
    });

    /**
     * Forgot GET
     */
    app.get('/forgot', checkAuth, function (req, res) {
        res.render('index');
    });

    /**
     * Password reset with token GET
     */
    app.get('/password/reset/:token', function (req, res) {
        res.render('index');
    });

    /**
     * Password reset GET
     */
    app.get('/reset/password', function (req, res) {
        res.render('index');
    });

    /**
     * Routes define for api calling methods
     */
    var includeApiMethodsJs = require('./modules/api/apiMethods');
    app.post('/api/login', includeApiMethodsJs.login);
    app.post('/api/create', includeApiMethodsJs.create);
    app.post('/api/fetchUserByEmail', includeApiMethodsJs.fetchUserByEmail);

    /**
     * Upload profile picture
     * @type {multer}
     */
    var multer = require('multer');
    var fs = require('fs');
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './profile_picture_upload/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
        }
    });
    var upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    app.post('/upload/profile/detail', function (req, res) {
        upload(req, res, function (err) {
            if (err) {
                res.json({status: false, message: err});
                return;
            }

            var post = {
                user_id: req.session.user_id,
                display_picture: req.file.filename,
                phone: req.body.phone,
                interest: req.body.interest
            };

            var sql = connection.query('INSERT INTO sm_profile SET ?', post, function (err, result) {
                if (err) {
                    fs.unlink(req.file.path);
                    res.send({success: false, message: 'error occurred during upload method - ' + err.code});
                } else if (result.insertId > 0) {
                    res.send({success: true, message: '', data: ''});
                } else {
                    res.send({success: false, message: 'sorry, profile picture not uploaded', data: result});
                }
            });
        });
    });

};

/**
 * Method to authenticate whether user exist in session or not
 *
 * @param req
 * @param res
 * @param next
 */
function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    }
}


