var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds145921.mlab.com:45921/bookmyslot');

// autoIncrement.initialize(connection);

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

// userSchema.plugin(autoIncrement.plugin, 'User');

mongoose.model("User", userSchema);