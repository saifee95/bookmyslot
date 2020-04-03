var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds055397.mlab.com:55397/bookmyslot');

autoIncrement.initialize(connection);

var userSchema = new mongoose.Schema({
    userid : {
    	type:String,
    	index:true
    },
    email : {
    	type:String
    },
    passwd : String
});

userSchema.plugin(autoIncrement.plugin, 'User');

mongoose.model("User", userSchema);