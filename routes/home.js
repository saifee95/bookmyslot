var express = require('express');
var app = express();
var router = express.Router();

router.get('/',function(req,res){

	res.render('home',{title:'BookMySlot'});

});


module.exports = router;
