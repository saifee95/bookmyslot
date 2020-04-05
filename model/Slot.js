var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
require('./User');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds055397.mlab.com:55397/bookmyslot');

autoIncrement.initialize(connection);

var slotSchema = new mongoose.Schema({
    owner : {
    	type:Number,
    	ref:'User'
    },
    slot_time : {
    	type:Number,
    	required:true
    },
    slot_date : {
    	type: String,
    	required:true	
    },
    availability:{
        type:Boolean,
        required:true
    },
    created_at:{
        type:Date
    }
});

slotSchema.plugin(autoIncrement.plugin, 'Slot');

mongoose.model("Slot", slotSchema);