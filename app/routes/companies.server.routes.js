'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var companies = require('../../app/controllers/companies.server.controller');

	// Companies Routes
	app.route('/companies')
		.get(companies.listByStatus)
		.post(users.requiresLogin, companies.create);

	app.route('/checkout')
			.post(companies.checkout);

	app.route('/client_token')
			.get(companies.getClientToken);

	app.route('/companiesByUser')
			.get(companies.listByUser);

	app.route('/companies/:companyId')
		.get(companies.read)
		.put(users.requiresLogin, companies.update)
		.delete(users.requiresLogin, companies.hasAuthorization, companies.delete);

	// Finish by binding the Company middleware
	app.param('companyId', companies.companyByID);
};
