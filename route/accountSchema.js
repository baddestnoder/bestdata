const mongoose = require("mongoose");



const thisSchema = new mongoose.Schema({

	email: {
		required: true,
		type: String
	},

	fullName: {
		required: true,
		type: String
	},


	state: {
		required: true,
		type: String
	},


	lga: {
		required: true,
		type: String
	},


	password: {
		required: true,
		type: String
	},


	rePassword: {
		required: true,
		type: String
	},

	reward: {
		required: true,
		type: Number
	},

	wallet: {
		required: true,
		type: Number
	},

	agent: {
		required: true,
		type: String
	},

	purchase: {
		required: true,
		type: Boolean
	},

	isFacebook: {
		required: true,
		type: Boolean
	},


	time: {
		required: true,
		type: Number
	},

	

	device: {
		required: true,
		type: String
	}
});



const ThisModel = new mongoose.model("altAccount", thisSchema);

module.exports = ThisModel;