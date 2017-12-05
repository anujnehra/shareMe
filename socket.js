module.exports = function(app) {
    var http = require("http").createServer(app);
    var io = require("socket.io")(http);
    http.listen(8080, "127.0.0.1");

    io.on('connection', function(socket) {
        socket.on('add-customer', function(customer) {
            io.emit('notification', {
                message: 'new customer',
                customer: customer
            });
        });
        
    });
}