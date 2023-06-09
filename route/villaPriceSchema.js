const mongoose = require("mongoose");



const thisSchema = new mongoose.Schema({

	drink: {
		required: true,
		type: String
	},

	wholesale: {
		required: true,
		type: String
	},

	retail: {
		required: true,
		type: String
	},

	profit: {
		required: true,
		type: String
	},


	number: {
		required: true,
		type: Number
	}

});



const ThisModel = new mongoose.model("villaPrice", thisSchema);

module.exports = ThisModel;