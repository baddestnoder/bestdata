const router = require("express").Router();









router.get("/term", (req, res)=>{
	res.render("term.ejs");
});










module.exports = router;