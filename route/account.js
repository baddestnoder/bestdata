const router = require("express").Router();
const AccountDB = require("./accountSchema.js");
const jwt = require("jsonwebtoken");
const QueueDB = require("./atmCard.js");







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










router.get("/queue", async(req, res)=>{


	getEmail(req, res);

	if(isUser === true){

		try{
			const data = await QueueDB.find();
			res.render("queue.ejs", {data})

		}catch(error){
			console.log(error);
		}
	}

});











module.exports = router;
