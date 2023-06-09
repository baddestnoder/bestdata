const express = require("express");
const jwt = require("jsonwebtoken");
const AccountSchame = require("./accountSchema.js");


const router = express();



router.get("/profile", async(req, res)=>{

	const signature = req.cookies.signature;

	if(signature){
		jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
			if(error){
				res.cookie("signature", "", {httpOnly: true, maxAge: 1});
				res.redirect("/login");
			}else{
				const foundAccount = await AccountSchame.findOne({email: confirmSignature.email});
				if(foundAccount){
					res.render("profile.ejs", {data: foundAccount});
				}else{
					res.cookie("signature", "", {httpOnly: true, maxAge: 1});
					res.redirect("/login");
				}
			}
		})
	}else{
		res.redirect("/login");
	}
	
});



module.exports = router;