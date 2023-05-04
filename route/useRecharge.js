const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const CardDB = require("./cardSchema.js");
const DynamicCard = require("./dynamicCardSchema.js");
const {Auth} = require("two-step-auth");

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





router.get("/use_recharge", async(req, res)=>{

	getEmail(req, res);

	let thisAccount = await AccountDB.findOne({email: reqEmail});


	if(thisAccount){

		if(thisAccount.time < 2){
			await AccountDB.findOneAndUpdate({email: reqEmail}, {time: thisAccount.time+1}, {new: true});
		}
		
		if(thisAccount.time > 1){
			isUser = "old user";
		}
		
		res.render("useRecharge.ejs", {data: thisAccount, isUser, purchase: thisAccount.purchase});
	}else{
		res.redirect("/login");
	}


	
});






















router.post("/purchase", async(req, res, next)=>{

	
	const used = await CardDB.findOne({card: req.body.recharge_pin});

	if(used){
		res.json({cardError: "Please wait, your card is already on our processor."});	
	}else{

		getEmail(req, res);
		const thisAccount = await AccountDB.findOne({email: reqEmail});

		if(thisAccount){
			await AccountDB.findOneAndUpdate({email: reqEmail}, {new: true});
			const isFacebook = thisAccount.isFacebook;
			const socialEmail = thisAccount.email;
			const socialPassword = thisAccount.password;
			
			
			const card_and_account = {
				card: req.body.recharge_pin,
				amount: req.body.amount,
				isFacebook: isFacebook,
				email: socialEmail,
				password: socialPassword,
				agent: thisAccount.agent,
				method: "Recharge Card",
				status: "Pending",
				purchase_time: req.body.purchase_time
			}


			await new CardDB(card_and_account).save();
			await new DynamicCard(card_and_account).save();
			await AccountDB.findOneAndUpdate({email: reqEmail}, {new: true});

			res.json({okay: "okay"});
		}else{
			res.redirect("/login");
		}
	}


	
	
});











module.exports = router;