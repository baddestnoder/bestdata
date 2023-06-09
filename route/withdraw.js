const express = require("express");

const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const CardDB = require("./cardSchema.js");



const router = express.Router();








	

router.get("/withdrawCheck", async(req, res)=>{

	const signature = req.cookies.signature;

	if(signature){
		jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
			if(error){
				res.redirect("/login");
			}else{
				const foundAccount = await AccountDB.findOne({email: confirmSignature.email});
				if(foundAccount){
					res.render("withdrawCheck.ejs", {number: confirmSignature.email});
				}else{
					res.redirect("/login");
				}
			}
		});
	}else{
		res.redirect("/login");
	}
});














router.get("/withdraw", async(req, res)=>{
	const signature = req.cookies.signature;

	if(signature){
		jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
			if(error){
				res.redirect("/login");
			}else{
				const foundAccount = await AccountDB.findOne({email: confirmSignature.email});
				if(foundAccount){
					res.render("withdraw.ejs", {data: foundAccount});
				}else{
					res.redirect("/login");
				}
			}
		});
	}else{
		res.redirect("/login");
	}

});




module.exports = router;