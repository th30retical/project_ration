'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Company = mongoose.model('Company'),
	_ = require('lodash');

	var util = require('util');
	var braintree = require('braintree');

	var gateway = braintree.connect({
		environment: braintree.Environment.Sandbox,
		merchantId: '2wdjtb3hyj8zpfgp',
		publicKey: 'v6xzqyvr9wphw92z',
		privateKey: '05da9448a69c8bee234f50b17a3ba5fe'
	});

/**
 * Create a Company
 */
exports.create = function(req, res) {
	var company = new Company(req.body);
	company.user = req.user;

	company.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(company);
		}
	});
};

exports.getClientToken = function(req, res){
	gateway.clientToken.generate({}, function (err, response) {
		// console.log(response.clientToken);
    res.send(response.clientToken);
  });
};

/**
 * Show the current Company
 */
exports.read = function(req, res) {
	res.jsonp(req.company);
};

/**
 * Update a Company
 */
exports.update = function(req, res) {
	var company = req.company ;

	company = _.extend(company , req.body);

	company.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(company);
		}
	});
};

exports.checkout = function(req, res){
	// console.log(req.body);
	console.log('amount: ', req.body.creditCard.amount);
	console.log('number: ', req.body.creditCard.creditCard.number);
	console.log('expirationdate: ', req.body.creditCard.creditCard.expirationDate);
		gateway.transaction.sale({
			amount: req.body.creditCard.amount,
			creditCard: {
				number: req.body.creditCard.creditCard.number,
				expirationDate: req.body.creditCard.creditCard.expirationDate
			}
		}, function (err, result) {
			if (err) throw err;
			if (result.success) {
				util.log('Transaction ID: ' + result.transaction.id);
				res.jsonp(parseFloat(req.body.creditCard.amount));
			} else {
				util.log(result.message);
				return res.status(400).send({
					message: result.message
				});
			}
		});
	};

/**
 * Delete an Company
 */
exports.delete = function(req, res) {
	var company = req.company ;

	company.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(company);
		}
	});
};

/**
 * List of Companies
 */
exports.list = function(req, res) {
	Company.find().sort('-created').populate('user', 'displayName').exec(function(err, companies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(companies);
		}
	});
};


exports.listByStatus = function(req, res) {
	Company.find({status: true}).sort('-created').populate('user', 'displayName').exec(function(err, companies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(companies);
		}
	});
};

/**
 * List of Companies by Users
 */
exports.listByUser = function(req, res) {
	Company.find({user: req.user._id}).sort('-created').populate('user', 'displayName').exec(function(err, companies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			res.jsonp(companies);
		}
	});
};

/**
 * Company middleware
 */
exports.companyByID = function(req, res, next, id) {
	Company.findById(id).populate('user', 'displayName').exec(function(err, company) {
		if (err) return next(err);
		if (! company) return next(new Error('Failed to load Company ' + id));
		req.company = company ;
		next();
	});
};

/**
 * Company authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.company.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
