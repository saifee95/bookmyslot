var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://<user>:<password>@ds145921.mlab.com:45921/bookmyslot');

var userSchema = new mongoose.Schema({
    userid : {
    	type:String,
    	unique:true,
    	required:true
    },
    email : {
    	type:String,
    	required:true
    },
    passwd : {
    	type: String,
    	required:true	
    } 
});

mongoose.model("User", userSchema);