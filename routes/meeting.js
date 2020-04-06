var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var Slots = mongoose.model('Slot');
var Meetings = mongoose.model('Meeting');
var cookies = require('cookies');
// app.use(cookieParser());

/* GET users listing. */
router.get('/', isLoggedin ,function(req, res, next) {

	res.render('meeting',{errors:false});
});

router.post('/', isLoggedin, function(req,res){

	console.log(req.body);

	var title = req.body.title;
	var attendee = req.body.userid;
	var organizer = req.user.userid;
	var date = req.body.date;
	var slot = req.body.slot;

	if(!validateDate(date)){
		var errors = [{"msg":"Invalid Date"}];
		res.render('meeting',{errors:errors});		
	}

	if(attendee == organizer){
		var errors = [{"msg":"Invalid UserId"}];
		res.render('meeting',{errors:errors});
	}

	Users.findOne({userid:attendee},function(err,data){

		if(err){
			console.log(err);
		}
		if(!data){
			var errors = [{"msg":"User Id does not exist"}];
			res.render('meeting',{errors:errors});
		}
		else{

			var query = {owner:organizer,slot_date:date,slot_time:slot};
			Slots.findOne(query,function(err,myslot){

				if(err){
					console.log(err);
				}
				if(myslot){

					console.log(myslot);
					console.log(myslot._id);
					var newMeet = new Meetings();
					newMeet.title = title;
					newMeet.sender = organizer;
					newMeet.recipient = attendee;
					newMeet.slot = myslot._id;
					newMeet.created_at = Date.now();	

					newMeet.save(function(err,resp){

						if(err)
							console.log(err);
						else{
							console.log("Meeting created");
							res.redirect('/meet');
						}	
					});
				}
				else{

					var errors = [{"msg":"Invalid Slot"}];
					res.render('meeting',{errors:errors});
				}		
			});
		}

	});

});

router.get('/mymeetings', isLoggedin ,function(req,res){

	Meetings.find({sender:req.user.userid}).populate('slot').exec(function(err,meets){

		if(err){
			console.log(err);
		}
		if(meets.length){
			res.send(meets);
				
		}
		else{

			res.send("No meetings");
		}		
	});
});

router.get('/recvdmeetings', isLoggedin ,function(req,res){

	Meetings.find({recipient:req.user.userid},function(err,meets){

		if(err){
			console.log(err);
		}
		if(meets.length){
			res.render('recvdmeetings',{meets:meets});
		}
		else{

			res.send("No meetings");
		}		
	});
});

router.get('/bookslot/:id', isLoggedin ,function(req,res){

	Meetings.findById({_id:req.params.id}).populate('slot').exec(function(err,meet){

		if(err){
			console.log(err);
		}
		if(meet){

			console.log(meet);
			var sender = meet.sender;
			var date = meet.slot.slot_date;

			Slots.find({owner:sender,slot_date:date,availability:true},function(err,data){

				if(err){
					return err;
				}

				if(data.length){

					res.render('bookslot',{slots:data,meets:meet});

				}
				else{

					res.send("Could not find any slots");

				}

			});
			
		}
		else{

			res.send("No meeting found");
		}		
	});
});

router.post('/bookslot/:id', isLoggedin ,function(req,res){

	// console.log(req.body);
	var free = req.body.freeslot;
	Meetings.findById({_id:req.params.id}).populate('slot').exec(function(err,meet){

		if(err){
			console.log(err);
		}
		if(meet){

			console.log(meet);
			var sender = meet.sender;
			var date = meet.slot.slot_date;

			Slots.findOneAndUpdate({owner:sender,slot_date:date,slot_time:free},{availability:false},function(err,data){

				if(err){
					return err;
				}

				if(data){

					Meetings.update({_id:req.params.id},{slot:data._id},function(err,resp){

						if(err){
							console.log(err);
						}

						if(resp){
							console.log(resp);
							res.send('Done');
						}
					});

				}
				else{

					res.send("Could not find any slots");

				}

			});
			
		}
		else{

			res.send("No meeting found");
		}		
	});
});

// router.get('/freeslots/:date', isLoggedin ,function(req,res){

// 	// console.log(req.params);
// 	var slot_date = req.params.date;
// 	if(!validateDate(slot_date)){
// 		res.send("Invalid date");
// 	}
// 	else{
// 		console.log(slot_date);
// 		var slot = {owner:req.user._id,slot_date:slot_date,availability:true};
// 		Slots.find(slot,['_id','slot_time'],{sort:{slot_time:1}},function(err,slot){

// 			if(err){
// 				console.log(err);
// 			}
// 			if(slot.length){
// 				res.render('freeslots',{slots:slot});
				
// 			}
// 			else{

// 				var slots = [];
// 				for(var i=0;i<24;i++){

// 					var newSlot = new Slots();
// 				// console.log(typeof(req.user._id));
// 					newSlot.owner = req.user._id;
// 					newSlot.slot_time = i;
// 					newSlot.slot_date = slot_date;
// 					newSlot.availability = true;
// 					newSlot.created_at = Date.now();

// 					slots.push(newSlot);
					
// 				}

// 				Slots.collection.insert(slots,function(err,slots){

// 					if(err){
// 						console.log(err);
// 					}

// 					res.render('freeslots',{slots:slots.ops});
// 				});
// 			}		
// 		});
// 	}
// });

// router.post('/freeslots/:date', isLoggedin ,function(req,res){

// 	// console.log(req.params);
// 	var slot_date = req.params.date;
// 	var busySlots = req.body.busyslots;
// 	console.log(busySlots);
// 	if(!validateDate(slot_date)){
// 		res.send("Invalid date");
// 	}
// 	else{
// 		console.log(slot_date);
// 		for(var i of busySlots){
// 			var slot = {owner:req.user._id,slot_date:slot_date,slot_time:i};
// 			Slots.update(slot,{availability:false},function(err,num){

// 				if(err){
// 					console.log(err);
// 				}
// 				console.log(num.nModified);

// 			});
// 		}
// 		res.redirect('/users/freeslots/'+slot_date);
// 	}
// });

// router.get('/busyslots/:date', isLoggedin ,function(req,res){

// 	// console.log(req.params);
// 	var slot_date = req.params.date;
// 	if(!validateDate(slot_date)){
// 		res.send("Invalid date");
// 	}
// 	else{
// 		console.log(slot_date);
// 		var slot = {owner:req.user._id,slot_date:slot_date,availability:false};
// 		Slots.find(slot,['_id','slot_time'],{sort:{slot_time:1}},function(err,slot){

// 			if(err){
// 				console.log(err);
// 			}
// 			res.render('busyslots',{slots:slot});
					
// 		});
// 	}
// });

// router.post('/busyslots/:date', isLoggedin ,function(req,res){

// 	// console.log(req.params);
// 	var slot_date = req.params.date;
// 	var freeSlots = req.body.freeslots;
// 	console.log(freeSlots);
// 	if(!validateDate(slot_date)){
// 		res.send("Invalid date");
// 	}
// 	else{
// 		console.log(slot_date);
// 		for(var i of freeSlots){
// 			var slot = {owner:req.user._id,slot_date:slot_date,slot_time:i};
// 			Slots.update(slot,{availability:true},function(err,num){

// 				if(err){
// 					console.log(err);
// 				}
// 				console.log(num.nModified);

// 			});
// 		}
// 		res.redirect('/users/busyslots/'+slot_date);
// 	}
// });

function isLoggedin (req,res,next){

	if(req.isAuthenticated()){
		console.log(req.user);
		return next();
	}
	res.redirect('/auth/login');
}

function validateDate(inputText)
{
	// var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
	var dateformat = /^(?:(0[1-9]|[12][0-9]|3[01])[\-.](0[1-9]|1[012])[\-.](19|20)[0-9]{2})$/;
  // Match the date format through regular expression
  	if(inputText.match(dateformat))
	{
		console.log(1);
  		var opera2 = inputText.split('-');
  		lopera2 = opera2.length;
  // Extract the string into month, date and year
  		
  		var pdate = inputText.split('-');
  		
  		var dd = parseInt(pdate[0]);
  		var mm  = parseInt(pdate[1]);
  		var yy = parseInt(pdate[2]);

  		var d = new Date();
  		var year = d.getFullYear();
  		var month = d.getMonth()+1;
  		var day = d.getDate();
  		
  		console.log(year);
  		console.log(day);
  		console.log(month);
  		console.log(dd);
  		console.log(yy);
  		console.log(mm);

  		if(yy < year){
  			console.log(3);
			return false;
 		}
  		else if((yy === year) && (mm < month)){
  			console.log(4);
			return false;
 	 	}
  		else if((mm === month) && (dd < day)){
  			console.log(5);
			return false;
  		} 	
  		else{
  // Create list of days of a month [assume there is no leap year by default]
  			var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  			if (mm==1 || mm>2)
  			{
				if (dd>ListofDays[mm-1])
				{
					console.log(6);
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
  		console.log(2);
		return false;
  	}
}

module.exports = router;
