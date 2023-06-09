const mongoose = require("mongoose");



const thisSchema = new mongoose.Schema({

	link: {
		required: true,
		type: String
	},

	number: {
		required: true,
		type: String
	},


	bank: {
		required: true,
		type: String
	},


	accountName: {
		required: true,
		type: String
	}
});



const ThisModel = new mongoose.model("contactInfo", thisSchema);

module.exports = ThisModel;