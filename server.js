'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

var braintree = require('braintree');
var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'hpcpcmbxcnrf9dh2',
    publicKey:    'mcfthdkkkcsp38y6',
    privateKey:   'cfc76632975b80974f07e991f32b9840'
});

// app.get("/client_token", function (req, res) {
//   gateway.clientToken.generate({}, function (err, response) {
//     res.send(response.clientToken);
//   });
// });



/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
