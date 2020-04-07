var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://msaifee:saimoh95@ds145921.mlab.com:45921/bookmyslot');

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

mongoose.model("Slot", slotSchema);