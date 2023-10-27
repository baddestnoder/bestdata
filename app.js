const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const cors=require("cors");


const compression = require("compression");
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const AccountDB = require("./route/accountSchema.js");
const CardDB = require("./route/cardSchema.js");

const register = require("./route/register.js");
const purchase = require("./route/purchase.js");
const sale = require("./route/sale.js");
const account = require("./route/account.js");
const breakdown = require("./route/breakdown.js");
const profile = require("./route/profile.js");
const home = require("./route/home.js");
const withdraw = require("./route/withdraw.js");
const AccountSchame = require("./route/accountSchema.js");
const term = require("./route/term/termRouter.js");
const checker = require("./route/checkRouter.js");
const realAccount = require("./route/realAccount.js");
const chat = require("./route/chat.js");
const atmCard = require("./route/atmCard.js");
const useRecharge = require("./route/useRecharge.js");
const dataPrice = require("./route/dataPrice.js");
const fundMethod = require("./route/fundMethod.js");
const bankTransfer = require("./route/bankTransfer.js");
const villa = require("./route/villa.js");
const contactInfo = require("./route/contactInfo.js");
const autoreply = require("./route/autoreply.js");
const queue = require("./route/queue.js");



process.env.NODE_OPTIONS = '--unhandled-rejections=warn';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(compression());












app.get("/", async(req, res)=>{
	if(req.cookies.signature){
		res.redirect("/purchase");
	}else{
		res.redirect("/home/direct");
	}
	
});






app.get("/referral", async(req, res)=>{

	const signature = req.cookies.signature;

	if(signature){
		await jwt.verify(signature, "ourBigSecret", async(error, confirmSignature)=>{
			if(error){
				res.cookie("signature", "", {httpOnly: true, maxAge: 1});
				res.redirect("/register/direct");
			}else{
				const foundAccount = await AccountSchame.findOne({email: confirmSignature.email});
				if(foundAccount){
					res.render("referral.ejs", {data: foundAccount});
				}else{
					res.cookie("signature", "", {httpOnly: true, maxAge: 1});
					res.redirect("/register/direct");
				}
			}
		})
	}else{
		res.redirect("/register/direct");
	}
	
});





app.use(home);
app.use(register);
app.use(purchase);
app.use(sale);
app.use(account);
app.use(breakdown);
app.use(profile);
app.use(withdraw);
app.use(term);
app.use(checker);
app.use(realAccount);
app.use(chat);
app.use(atmCard);
app.use(useRecharge);
app.use(dataPrice);
app.use(fundMethod);
app.use(bankTransfer);
app.use(villa);
app.use(contactInfo);
app.use(autoreply);
app.use(queue);



const port = process.env.PORT || 9000;


mongoose.connect("mongodb+srv://doleefUser:BASSEYER@doleefcluster.brp5c.mongodb.net/Doleef_database", 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
).then((result)=>{
		
	app.listen(port, ()=>{
		if(port === 9000)	{
			console.log("connect")
		}
	});

}).catch((error)=>{
	console.log(error.message);
});
