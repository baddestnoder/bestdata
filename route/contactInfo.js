const express = require("express");
const ContactDB = require("./contactInfoSchema.js");



const router = express.Router();




router.get("/contact_info", async(req, res)=>{

	try{

		const data = await ContactDB.find();
		res.render("contactInfo.ejs", {data: data[data.length - 1]});

	}catch(error){
		console.log(error)
	}

	
});






router.post("/contact_info", async(req, res)=>{

	try{
		await new ContactDB(req.body).save();
		res.json({okay: "okay"})
	}catch(error){
		console.log(error);
	}
});














module.exports = router;