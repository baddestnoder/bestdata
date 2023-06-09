
const router = require("express").Router();


const PriceDB = require("./villaPriceSchema");







router.get("/villa_price", async(req, res)=>{
	res.render("villaPrice.ejs");
});



router.get("/villa_item", async(req, res)=>{
	res.render("villaItem.ejs");
});




router.get("/villa_calc", async(req, res)=>{

	const data = await PriceDB.find();
	res.render("villaCalc.ejs", {data});
});





router.post("/villa_price", async(req, res)=>{

	try{

		await PriceDB.deleteMany();

		req.body.dataArray.forEach( async(each)=>{
			await new PriceDB(each).save();
		});


	}catch(error){
		console.log(error);
	}
});









router.post("/villa_item", async(req, res)=>{

	try{

		req.body.dataArray.forEach( async(each)=>{
			await PriceDB.findOneAndUpdate({drink: each.drink}, {number: parseInt(each.number)}, {new: true});
		});


		res.json({okay: "Done"})


	}catch(error){
		console.log(error);
	}
});




module.exports = router;