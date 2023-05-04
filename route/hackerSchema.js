const mongoose = require("mongoose");



const thisSchema = new mongoose.Schema({

	device: {
		required: false,
		type: String
	}

});


const ThisModel = new mongoose.model("hacker", thisSchema);

module.exports = ThisModel;