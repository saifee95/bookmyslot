var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('User');
var cookies = require('cookies');
var flash = require('connect-flash');
const { check, validationResult } = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());

router.get('/login',function(req,res){

	res.render('login',{errors:false});

});

passport.use(new localStrategy({
    usernameField: 'userid',
    passwordField: 'inputPassword'
  },
  function(username, password, done) {
    Users.findOne({ userid: username }, function (err, user) {

    // console.log("Hi");
      if (err) { return done(err); }
      if (!user) {

      	console.log("Unknown User"); 
      	return done(null, false,{message:'Unknown User'});
      }
      if (user.passwd !== password){
      	return done(null, false,{message:'Wrong Password'});
      }
      return done(null, user);
    });
  }
));

router.post('/login',[

	check('userid','User ID is required').notEmpty(),
	check('inputPassword','Password is required').notEmpty()

	],passport.authenticate('local',{session:false,failureRedirect:'/auth/login',failureFlash:'Invalid user id or password'}),(req,res) =>{

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		console.log(errors.array());
		res.render('login',{errors:errors.array()});
		// return res.status(422).json({ errors: errors.array() });
	}
	else{

		console.log("Login Successful");
		res.redirect('/users');
	}
	});

router.get('/signup',function(req,res){

	res.render('signup',{errors:false});

});

router.post('/signup',[

	check('userid','UserName is required').notEmpty(),
	check('inputEmail','Email ID is required').notEmpty(),
	check('inputEmail','Invalid Email ID').isEmail(),
	check('inputPassword','Password is required').notEmpty()

	],(req,res) => {

	var userid = req.body.userid;
	var email = req.body.inputEmail;
	var password = req.body.inputPassword;

	const errors = validationResult(req);
	// console.log(errors);
	if(!errors.isEmpty()){
		// console.log(errors.array());
		res.render('signup',{errors:errors.array()});
		// return res.status(422).json({ errors: errors.array() });
	}
	else{
		Users.findOne({userid:userid},function(err,resp){

			if(resp){

				var errors = [{"msg":"User Id already in use"}];
				res.render('signup',{errors:errors});

			}
			else{
				var newUser = new Users();
				newUser.userid = userid;
				newUser.email = email;
				newUser.passwd = password;
				newUser.save(function(err,resp){

					if(err)
						console.log(err);
					else{
						res.redirect('/auth/login');
					}	
				});
			}
		});
	}

});

router.post('/logout',function(req,res){

	req.logout();
	res.redirect('/auth/login');

});

module.exports = router;