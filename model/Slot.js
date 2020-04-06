var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds145921.mlab.com:45921/bookmyslot');

// autoIncrement.initialize(connection);

var slotSchema = new mongoose.Schema({
    owner : {
    	type:String,
        index:true,
        required:true
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

// slotSchema.plugin(autoIncrement.plugin, 'Slot');

mongoose.model("Slot", slotSchema);