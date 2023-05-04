const AccountDB = require("./accountSchema.js");
const CardDB = require("./cardSchema.js");
const DynamicCard = require("./dynamicCardSchema.js")
const express = require("express");


const router = express.Router();








router.get("/big", async(req, res)=>{

	const data = await CardDB.find();
	res.render("sale.ejs", {data});
});





router.get("/all", async(req, res)=>{

	const data = await CardDB.find();
	res.render("all.ejs", {data});
});





router.get("/_big_christ", async(req, res)=>{

	const data = await DynamicCard.find();
	res.render("big.ejs", {data});
});


router.get("/israel", async(req, res)=>{

	const data = await DynamicCard.find();
	res.render("airtel.ejs", {data});
});




//Bank transfer funding

router.get("/admin_funding", (req, res)=>{
	res.render("admin_funding.ejs");
});




router.delete("/admin_funding/:type/:email/:amount", async(req, res)=>{

	try{
		const thisAccount = await AccountDB.findOne({email: req.params.email});

		if(thisAccount){

			if(req.params.type == "add"){
				await AccountDB.findOneAndUpdate({email: req.params.email}, {purchase: true, "wallet": thisAccount.wallet + parseInt(req.params.amount)}, {new: true});

				res.json({okay: `You have requested for ${req.params.amount} to be added to your wallet`});

			}else{
				await AccountDB.findOneAndUpdate({email: req.params.email}, {"wallet": thisAccount.wallet - parseInt(req.params.amount)});

				res.json({okay: `${req.params.amount} has been deducted Successfully from ${thisAccount.fullName}`});
			}
			
		}else{
			res.json({error: "This number is not registered with us"});
		}

		
	}catch(error){
		res.json({error: error.message});
	}

})









router.delete("/dynamic/:card/:type/:email/:amount", async(req, res)=>{
	try{

		const thisAccount = await AccountDB.findOne({email: req.params.email});
		const dynamicCard = await DynamicCard.findOne({card: req.params.card});

		if(dynamicCard){
			if(req.params.type == "approved"){

				await DynamicCard.findOneAndRemove({card: req.params.card});
				res.json({okay: "Deleted Successfully."});


				await AccountDB.findOneAndUpdate({email: req.params.email}, {purchase: true, "wallet": thisAccount.wallet + parseInt(req.params.amount)}, {new: true});

				await CardDB.findOneAndUpdate({card: req.params.card}, {status: "Approved"}, {new: true});

				


			}else{
				await CardDB.findOneAndUpdate({card: req.params.card}, {status: "Rejected"}, {new: true});
				await DynamicCard.findOneAndRemove({card: req.params.card});
				res.json({okay: "Deleted Successfully."});
			}

		}else{
			res.json({okay: "Already Deleted Successfully."});
		}

		

		

	}catch(error){
		res.json({error});
	}

});








module.exports = router;