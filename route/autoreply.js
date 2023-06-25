const router = require("express").Router();
const jwt = require("jsonwebtoken");
const AccountDB = require("./accountSchema.js");





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










router.get("/chatting", async(req, res)=>{



	getEmail(req, res);


	if(isUser === true){

		let thisAccount = await AccountDB.findOne({email: reqEmail});


		if(thisAccount){

			res.render("autoreply.ejs", {data: thisAccount});
			
		}else{
			res.redirect("/login");
		}
	}
});












module.exports = router;