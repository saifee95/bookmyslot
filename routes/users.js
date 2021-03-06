var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var Slots = mongoose.model('Slot');
var cookies = require('cookies');
// app.use(cookieParser());

/* GET users listing. */
router.get('/', isLoggedin ,function(req, res, next) {

	res.render('users');
});

router.get('/logout',function(req,res){

	req.logout();
	res.redirect("/auth/login");

});

router.get('/myslots/:date', isLoggedin ,function(req,res){

	var slot_date = req.params.date;
	if(!validateDate(slot_date)){
		res.send("Invalid date");
	}
	else{
		var query = {owner:req.user.userid,slot_date:slot_date};
		Slots.find(query,function(err,slot){

			if(err){
				console.log(err);
			}
			if(slot.length){
				res.send(slot);
			}
			else{

				var slots = [];
				for(var i=0;i<24;i++){

					var newSlot = new Slots();
					newSlot.owner = req.user.userid;
					newSlot.slot_time = i;
					newSlot.slot_date = slot_date;
					newSlot.availability = true;
					newSlot.created_at = Date.now();

					slots.push(newSlot);
					
				}

				Slots.collection.insert(slots,function(err,data){

					if(err){
						console.log(err);
					}

					res.send(data.ops);
				});
			}		
		});
	}
});

router.get('/freeslots/:date', isLoggedin ,function(req,res){

	var slot_date = req.params.date;
	if(!validateDate(slot_date)){
		res.send("Invalid date");
	}
	else{
		var query = {owner:req.user.userid,slot_date:slot_date,availability:true};
		Slots.find(query,['_id','slot_time'],{sort:{slot_time:1}},function(err,slot){

			if(err){
				console.log(err);
			}
			if(slot.length){
				res.render('freeslots',{slots:slot});
				
			}
			else{

				var slots = [];
				for(var i=0;i<24;i++){

					var newSlot = new Slots();
					newSlot.owner = req.user.userid;
					newSlot.slot_time = i;
					newSlot.slot_date = slot_date;
					newSlot.availability = true;
					newSlot.created_at = Date.now();

					slots.push(newSlot);
					
				}

				Slots.collection.insert(slots,function(err,data){

					if(err){
						console.log(err);
					}

					res.render('freeslots',{slots:data.ops});
				});
			}		
		});
	}
});

router.post('/freeslots/:date', isLoggedin ,function(req,res){

	var slot_date = req.params.date;
	var busy = req.body.busyslots;
	var busySlots = [];
	if(typeof busy === 'string'){
		busySlots.push(busy);
	}
	else{
		busySlots = busy;
	}	
	if(!validateDate(slot_date)){
		res.send("Invalid date");
	}
	else{
		for(var i of busySlots){
			var query = {owner:req.user.userid,slot_date:slot_date,slot_time:i};
			Slots.update(query,{availability:false},function(err,num){

				if(err){
					console.log(err);
				}

			});
		}
		res.redirect('/users/freeslots/'+slot_date);
	}
});

router.get('/busyslots/:date', isLoggedin ,function(req,res){

	var slot_date = req.params.date;
	if(!validateDate(slot_date)){
		res.send("Invalid date");
	}
	else{
		var query = {owner:req.user.userid,slot_date:slot_date,availability:false};
		Slots.find(query,['_id','slot_time'],{sort:{slot_time:1}},function(err,slot){

			if(err){
				console.log(err);
			}
			res.render('busyslots',{slots:slot});
					
		});
	}
});

router.post('/busyslots/:date', isLoggedin ,function(req,res){

	var slot_date = req.params.date;
	var free = req.body.freeslots;
	var freeSlots = [];
	if(typeof free === 'string'){
		freeSlots.push(free);
	}
	else{
		freeSlots = free;
	}

	if(!validateDate(slot_date)){
		res.send("Invalid date");
	}
	else{
		for(var i of freeSlots){
			var query = {owner:req.user.userid,slot_date:slot_date,slot_time:i};
			Slots.update(query,{availability:true},function(err,num){

				if(err){
					console.log(err);
				}
				console.log(num.nModified);
			});
		}
		res.redirect('/users/busyslots/'+slot_date);
	}
});

function isLoggedin (req,res,next){

	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/auth/login');
}

function validateDate(inputText)
{
	var dateformat = /^(?:(0[1-9]|[12][0-9]|3[01])[\-.](0[1-9]|1[012])[\-.](19|20)[0-9]{2})$/;
  // Match the date format through regular expression
  	if(inputText.match(dateformat))
	{

   		var pdate = inputText.split('-');
  		
  		var dd = parseInt(pdate[0]);
  		var mm  = parseInt(pdate[1]);
  		var yy = parseInt(pdate[2]);

  		var d = new Date();
  		var year = d.getFullYear();
  		var month = d.getMonth()+1;
  		var day = d.getDate();

  		if(yy < year){
			return false;
 		}
  		else if((yy === year) && (mm < month)){
			return false;
 	 	}
  		else if((mm === month) && (dd < day)){
			return false;
  		} 	
  		else{
  // Create list of days of a month [assume there is no leap year by default]
  			var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  			if (mm==1 || mm>2)
  			{
				if (dd>ListofDays[mm-1])
				{
					return false;
				}
  			}	

  			if (mm==2)
  			{
				var lyear = false;
				if ( (!(yy % 4) && yy % 100) || !(yy % 400)) 
				{
					lyear = true;
				}
				if ((lyear==false) && (dd>=29))
				{
					return false;
				}
				if ((lyear==true) && (dd>29))
				{
					return false;
				}
  			}
  			return true;
  		}
	}
  	else
  	{
		return false;
  	}
}

module.exports = router;
