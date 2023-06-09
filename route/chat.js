const router = require("express").Router();
const jwt = require("jsonwebtoken");
const AccountDB = require("./accountSchema.js");











router.get("/chat", async(req, res)=>{

	const reqCookie = req.cookies.signature;

	if(reqCookie){
		jwt.verify(reqCookie, "ourBigSecret", (error, correctCookie)=>{
			if(correctCookie){
				res.render("chat.ejs", {number: correctCookie.email});
			}else{
				res.redirect("/login");
			}
		})
	}else{
		res.redirect("/login");
	}





	router.get("/edit/:number/:actuallReward", async(req, res)=>{

		let actuallReward = parseInt(req.params.actuallReward);
		const thisAccount = await AccountDB.findOneAndUpdate({email: req.params.number}, {reward: actuallReward});

		res.json({okay: "okay"});
	});




	router.get("/withdraw/:number", async(req, res)=>{

		let thisAccount = await AccountDB.findOne({email: req.params.number})
		await AccountDB.findOneAndUpdate({email: req.params.number}, {reward: thisAccount.reward - 10000});

		res.json({okay: "okay"});
	})




	
});














module.exports = router;