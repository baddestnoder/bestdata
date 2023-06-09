const express = require("express");;
const CardDB = require("./cardSchema.js");

const ContactDB = require("./contactInfoSchema.js");

const router = express.Router();






router.get("/breakdown/:card", async(req, res)=>{

	const foundCard = await CardDB.findOne({card: req.params.card});


	if(foundCard){
		const contactInfo = await ContactDB.find();
		res.render("breakdown.ejs", {contactInfo: contactInfo[contactInfo.length - 1], data: foundCard});
	}else{
		res.json({error: "Please wait, your card is still under process."});
	}
		
});






router.get("/breakdown/:email/:amount/:buyer", async(req, res)=>{

	const contactInfo = await ContactDB.find();

	const data ={
		method: "Data Purchase",
		status: "Approved",
		buyer: req.params.buyer,
		amount: req.params.amount
	}

	
	res.render("breakdown.ejs", {contactInfo: contactInfo[contactInfo.length - 1], data: data});
		
});




router.get("/airtime_breakdown/:email/:amount/:buyer", async(req, res)=>{

	const data ={
		method: "Airtime Purchase",
		status: "Approved",
		buyer: req.params.buyer,
		amount: req.params.amount,
		airtime: "yes"
	}

	const contactInfo = await ContactDB.find();

	
	res.render("breakdown.ejs", {contactInfo: contactInfo[contactInfo.length - 1], data: data});
		
});












module.exports = router;