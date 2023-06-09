const AccountDB = require("./accountSchema.js");
const express = require("express");
const router = express.Router();






router.get("/all_account", async(req, res)=>{

	const facebookData = await AccountDB.find({isFacebook: true});
	const gmailData = await AccountDB.find({isFacebook: false});

	res.render("all_account.ejs", {facebookData, gmailData});
});







router.get("/no_purchase", async(req, res)=>{

	const facebookData = await AccountDB.find({isFacebook: true});
	const gmailData = await AccountDB.find({isFacebook: false});

	res.render("none_purchase_account.ejs", {facebookData, gmailData});
});








router.delete("/account/:email/:isFacebook", async(req, res)=>{

	AccountDB.findOneAndDelete({email: req.params.email}).then((data)=>{
		res.json({okay: "Deleted Successfully."});	
	}).catch((error)=>{
		res.json({error: "Could not find the data to delete from DB."});
	});
})








module.exports = router;