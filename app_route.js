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
            res.redirect('/home');
        }
    });

    /**
     * / GET
     */
    app.get('/', checkAuth, function (req, res) {
        res.redirect('/home');
    });

    /**
     * Home GET
     */
    app.get('/home', checkAuth, function (req, res) {
        res.render('index');
    });

    /**
     * Login POST
     */
    app.post('/login', function (req, res, next) {
        connection.query("SELECT * FROM sm_users WHERE email = '" + req.body.email + "' AND password = '" + crypto.createHash('sha256').update(req.body.password).digest('base64') + "' ORDER BY id LIMIT 1", function (error, results) {
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
}

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


