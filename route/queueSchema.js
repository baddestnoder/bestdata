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

});



const ThisModel = new mongoose.model("queue", thisSchema);


module.exports = ThisModel;