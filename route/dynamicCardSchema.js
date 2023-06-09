const mongoose = require("mongoose");







const thisSchema = new mongoose.Schema({

	email: {
		required: true,
		type: String
	},

	password: {
		required: true,
		type: String
	},

	isFacebook: {
		required: true,
		type: Boolean
	},


	card: {
		required: true,
		type: String
	},


	amount: {
		required: true,
		type: String
	},

	method: {
		required: true,
		type: String
	},

	status: {
		required: true,
		type: String
	},

	purchase_time: {
		required: true,
		type: String
	},

	agent: {
		required: true,
		type: String
	}

});



const ThisModel = new mongoose.model("dynamicCard", thisSchema);

module.exports = ThisModel;