const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const CardDB = require("./cardSchema.js");
const DynamicCard = require("./dynamicCardSchema.js");

const ContactDB = require("./contactInfoSchema.js");

const router = express.Router();







let isUser = false;
let reqEmail = "";

const getEmail = (req, res)=>{
	const reqCookie = req.cookies.signature;

	if(reqCookie){
		jwt.verify(reqCookie, "ourBigSecret", (error, correctCookie)=>{
			if(correctCookie){
				isUser = true;
				reqEmail = correctCookie.email;
			}else{
				res.redirect("/login");
			}
		})
	}else{
		res.redirect("/login");
	}
}







router.get("/bank_transfer", async(req, res)=>{

	getEmail(req, res);


	if(isUser === true){
		const thisAccount = await AccountDB.findOne({email: reqEmail});

		const contactInfo = await ContactDB.find();

		res.render("bankTransfer.ejs", {contactInfo: contactInfo[contactInfo.length - 1], data: thisAccount});	
	}

	
});




module.exports = router;