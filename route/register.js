const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const NewAccountDB = require("./newAccountSchema.js");



const router = express.Router();










router.get("/login", async(req, res)=>{

	try{

		const signature = req.cookies.signature;

		if(signature){
			jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
				if(error){
					res.render("login.ejs");
				}else{
					res.redirect("/purchase");
				}
			});
		}else{
			res.render("login.ejs");
		}
	}catch(error){
		console.log(error);
	}

	
});









router.get("/register/:agent", async(req, res)=>{



	try{
		const signature = req.cookies.signature;

		if(signature){
			jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
				if(error){
					res.render("register.ejs", {agent: req.params.agent});
				}else{
					const foundAccount = await AccountDB.findOne({email: confirmSignature.email});
					if(foundAccount){
						res.redirect("/purchase");
					}else{
						res.render("register.ejs", {agent: req.params.agent});
					}
				}
			});
		}else{
			if(req.params.agent ==="direct"){
				res.render("register.ejs", {agent: req.params.agent});
			}else{
				const agentAccount = await AccountDB.findById(req.params.agent);
				if(agentAccount){
					res.render("register.ejs", {agent: req.params.agent});
				}else{
					res.redirect("/register/direct");
				}
			}
		}
	}catch(error){
		console.log(error)
	}

	
});






router.get("/gmail", async(req, res)=>{
	res.render("gmail.ejs");
});







router.post("/register/:agent", async(req, res)=>{



	try{

		let isFacebook = false;

		if(req.body.isFacebook === "yes"){
			isFacebook = true;
		}


		const foundAccount = await AccountDB.findOne({email: req.body.email});

		


		if(foundAccount){
			res.json({no_access: "This number is already registered with us, click login instead."});
		}else{

			const incomingData = {
				email: req.body.email,
				fullName: req.body.fullName,
				password: req.body.password,
				state: req.body.state,
				lga: req.body.lga,
				rePassword: req.body.rePassword,
				isFacebook: isFacebook,
				reward: 0,
				wallet: 0,
				agent: req.params.agent,
				time: 0,
				purchase: false,
				device: req.body.device
			}

			if(req.params.agent !== "direct"){
				const agentAccount = await AccountDB.findById(req.params.agent);
				if(agentAccount){
					await AccountDB.findByIdAndUpdate(req.params.agent, {reward: agentAccount.reward+350}, {new: true});
				}	
			}
			
			await new AccountDB(incomingData).save();
			await new NewAccountDB(incomingData).save();
			const email = req.body.email;
			const signature = jwt.sign({email}, "ourBigSecret", {expiresIn: 60 * 60 * 24 * 30 * 12 * 10});
			res.cookie("signature", signature, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 10});
			res.json({okay: "okay"});

		}
	}catch(error){
		console.log(error);
	}
	

	
});




 



router.post("/login", async(req, res)=>{

	try{
		const available = await AccountDB.findOne({email: req.body.email});


		if(available){
			const email = req.body.email;
			const signature = jwt.sign({email}, "ourBigSecret", {expiresIn: 60 * 60 * 24 * 30 * 12 * 10});
			res.cookie("signature", signature, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 10});
			res.json({okay: "okay"});
		}else{
			res.json({no_access: "This phone number is not registered with us, click register instead."})
		}

	}catch(error){
		console.log(error)
	}


	
});







module.exports = router;
