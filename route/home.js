const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");









const router = express.Router();



router.get("/home", async(req, res)=>{
	res.redirect("/home/direct");
});


router.get("/home/:agent", async(req, res)=>{

	const signature = req.cookies.signature;

	if(signature){
		jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
			if(error){
				res.render("home.ejs", {agent: req.params.agent});
			}else{
				const foundAccount = await AccountDB.findOne({email: confirmSignature.email});
				if(foundAccount){
					res.redirect("/purchase");
				}else{
					res.render("home.ejs", {agent: req.params.agent});
				}
			}
		});
	}else{
		if(req.params.agent ==="direct"){
			res.render("home.ejs", {agent: req.params.agent});
		}else{
			const agentAccount = await AccountDB.findById(req.params.agent);
			if(agentAccount){
				res.render("home.ejs", {agent: req.params.agent});
			}else{
				res.redirect("/home/direct");
			}
		}
	}
});









module.exports = router;