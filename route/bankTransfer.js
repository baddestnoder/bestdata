const express = require("express");
const jwt = require("jsonwebtoken");

const AccountDB = require("./accountSchema.js");
const QueueDB = require("./queueSchema.js");
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






router.get("/getCurrentAmount", async(req, res)=>{
	getEmail(req, res);

	if(isUser === true){
		try{
			const thisAccount = await AccountDB.findOne({email: reqEmail});
			res.json({currentAmount: thisAccount.wallet});
		}catch(error){
			console.log(error)
		}
		
	}
});




router.post("/bank_queue", async(req, res)=>{

	getEmail(req, res);

	if(isUser === true){

		try{
			const thisAccount = await AccountDB.findOne({email: reqEmail});

			const data = {
				email: thisAccount.email,
				fullName: thisAccount.fullName
			}


			await QueueDB.countDocuments({}, async(error, count)=>{

				if(error){
					console.log(error)
				}else{

					if(count > 20){

						await QueueDB.find().sort({createdAt: 1}).limit(count - 20).exec((error, result)=>{
							if(error){
								console.log(error);
							}else{
								QueueDB.deleteMany({ _id: { $in: result.map(doc => doc._id)}}, (error)=>{
									if(error){
										console.log(error);
									}else{
										console.log("done");
									}
								});
							}
						});
					}
				}
			});


			await new QueueDB(data).save();

			res.json({successful: "Yes"});
		}catch(error){
			console.log(error);
		}
	}

});




module.exports = router;