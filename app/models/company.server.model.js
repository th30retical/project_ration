'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Company name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	status: {
		type: Boolean,
		default: false
	},
	money_usable: {
		type: Number,
		default: 0,
	},
	money_used: {
		type: Number,
		default: 0,
	},
	total: {
		type: Number,
		default: 0,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Company', CompanySchema);
